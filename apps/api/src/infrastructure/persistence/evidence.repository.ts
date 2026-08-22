import { and, eq, gt, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "../../persistence/database";
import { evidence, evidenceVersions } from "../../persistence/schema/evidence.schema";
import type { Evidence, EvidenceVersion } from "../../core/evidence/evidence.model";
import type {
  AppendLifecycleVersionInput,
  CreateEvidenceInput,
  EvidenceRepository,
} from "../../core/evidence/evidence.repository";

function toDomainEvidence(row: typeof evidence.$inferSelect): Evidence {
  return {
    id: row.id,
    userId: row.userId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toDomainVersion(row: typeof evidenceVersions.$inferSelect): EvidenceVersion {
  return {
    id: row.id,
    evidenceId: row.evidenceId,
    version: row.version,
    userId: row.userId,
    provenance: row.provenance,
    lifecycle: row.lifecycle,
    observedAt: row.observedAt,
    acceptedAt: row.acceptedAt,
    confidence: row.confidence,
    createdAt: row.createdAt,
  };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "23505"
  );
}

// Aliased handle onto evidence_versions used only inside the correlated
// NOT EXISTS subquery below, so it reads as a distinct range table from the
// outer evidence_versions reference in the same statement.
const newerVersion = alias(evidenceVersions, "newer_version");

export class DrizzleEvidenceRepository implements EvidenceRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByIdForUser(userId: string, id: string): Promise<Evidence | null> {
    const [row] = await this.db
      .select()
      .from(evidence)
      .where(and(eq(evidence.id, id), eq(evidence.userId, userId)))
      .limit(1);

    return row ? toDomainEvidence(row) : null;
  }

  async findVersionForUser(
    userId: string,
    evidenceId: string,
    version: number,
  ): Promise<EvidenceVersion | null> {
    const [row] = await this.db
      .select()
      .from(evidenceVersions)
      .where(
        and(
          eq(evidenceVersions.evidenceId, evidenceId),
          eq(evidenceVersions.userId, userId),
          eq(evidenceVersions.version, version),
        ),
      )
      .limit(1);

    return row ? toDomainVersion(row) : null;
  }

  async create(input: CreateEvidenceInput): Promise<EvidenceVersion> {
    return this.db.transaction(async (tx) => {
      await tx.insert(evidence).values({
        id: input.evidenceId,
        userId: input.userId,
        createdAt: input.now,
        updatedAt: input.now,
      });

      const [row] = await tx
        .insert(evidenceVersions)
        .values({
          id: input.versionId,
          evidenceId: input.evidenceId,
          version: 1,
          userId: input.userId,
          provenance: input.provenance,
          lifecycle: "active",
          observedAt: input.observedAt,
          acceptedAt: input.acceptedAt,
          confidence: input.confidence,
          createdAt: input.now,
        })
        .returning();

      if (!row) throw new Error("Failed to create evidence version");
      return toDomainVersion(row);
    });
  }

  /**
   * Appends a new, immutable EvidenceVersion row. Never UPDATEs or DELETEs
   * an existing row - the previous version is left exactly as it was.
   *
   * Concurrency safety is enforced by the database, not by a
   * read-then-compare-then-write in application code:
   *
   * - The INSERT ... SELECT only produces a candidate row when a row
   *   matching (evidenceId, userId, version = expectedVersion) actually
   *   exists right now - this is also where provenance/observedAt/
   *   acceptedAt/confidence are copied from, preserving the immutable
   *   append-only version model instead of re-deriving them.
   * - The correlated NOT EXISTS additionally refuses to append when a
   *   version newer than expectedVersion already exists for this evidence,
   *   so a stale (too old) expectedVersion can never create a gap or a
   *   branch in the history - it is rejected outright, never silently
   *   reinterpreted as "append after the true latest".
   * - The existing unique(evidenceId, version) constraint is the final,
   *   database-enforced backstop: if two concurrent requests both pass the
   *   WHERE/NOT EXISTS check for the same expectedVersion, only one INSERT
   *   can win; the other fails with a Postgres unique-violation (23505),
   *   caught below and translated into the same `null` conflict result the
   *   caller already expects, instead of throwing.
   */
  async appendLifecycleVersion(
    input: AppendLifecycleVersionInput,
  ): Promise<EvidenceVersion | null> {
    try {
      const [row] = await this.db
        .insert(evidenceVersions)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.versionId}`.as("id"),
              evidenceId: evidenceVersions.evidenceId,
              userId: evidenceVersions.userId,
              version: sql<number>`${evidenceVersions.version} + 1`.as("version"),
              provenance: evidenceVersions.provenance,
              lifecycle: sql<string>`${input.lifecycle}`.as("lifecycle"),
              observedAt: evidenceVersions.observedAt,
              acceptedAt: evidenceVersions.acceptedAt,
              confidence: evidenceVersions.confidence,
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(evidenceVersions)
            .where(
              and(
                eq(evidenceVersions.evidenceId, input.evidenceId),
                eq(evidenceVersions.userId, input.userId),
                eq(evidenceVersions.version, input.expectedVersion),
                notExists(
                  qb
                    .select({ one: sql`1` })
                    .from(newerVersion)
                    .where(
                      and(
                        eq(newerVersion.evidenceId, input.evidenceId),
                        gt(newerVersion.version, input.expectedVersion),
                      ),
                    ),
                ),
              ),
            ),
        )
        .returning();

      return row ? toDomainVersion(row) : null;
    } catch (error) {
      if (isUniqueViolation(error)) return null;
      throw error;
    }
  }
}
