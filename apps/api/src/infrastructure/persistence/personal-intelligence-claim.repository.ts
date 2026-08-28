import { and, asc, eq, exists, gt, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "../../persistence/database";
import {
  personalIntelligenceClaims,
  personalIntelligenceClaimVersions,
} from "../../persistence/schema/personal-intelligence.schema";
import { evidenceVersions } from "../../persistence/schema/evidence.schema";
import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimType,
  PersonalIntelligenceClaimVersion,
  PersonalIntelligenceProvenance,
  PersonalIntelligenceValueKind,
  PersonalIntelligenceLifecycle,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import type {
  AppendClaimCorrectionInput,
  CreateClaimInput,
  PersonalIntelligenceClaimRepository,
} from "../../core/personal-intelligence/personal-intelligence-claim.repository";
import type { EvidenceLifecycle, EvidenceProvenance, EvidenceVersion } from "../../core/evidence/evidence.model";

function toDomainClaim(
  row: typeof personalIntelligenceClaims.$inferSelect,
): PersonalIntelligenceClaim {
  return {
    id: row.id,
    userId: row.userId,
    claimType: row.claimType as PersonalIntelligenceClaimType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toDomainVersion(
  row: typeof personalIntelligenceClaimVersions.$inferSelect,
): PersonalIntelligenceClaimVersion {
  return {
    id: row.id,
    claimId: row.claimId,
    version: row.version,
    userId: row.userId,
    valueKind: row.valueKind as PersonalIntelligenceValueKind,
    valueText: row.valueText,
    provenance: row.provenance as PersonalIntelligenceProvenance,
    confidence: row.confidence,
    lifecycle: row.lifecycle as PersonalIntelligenceLifecycle,
    evidenceVersionId: row.evidenceVersionId,
    // Additive, D3 - see personal-intelligence-claim.model.ts. Always
    // null until a future, separately-scoped increment adds a write path
    // that sets it; mapped through here now purely so the domain type is
    // read-complete.
    inferenceId: row.inferenceId,
    observedAt: row.observedAt,
    acceptedAt: row.acceptedAt,
    createdAt: row.createdAt,
  };
}

function toDomainEvidenceVersion(
  row: typeof evidenceVersions.$inferSelect,
): EvidenceVersion {
  return {
    id: row.id,
    evidenceId: row.evidenceId,
    version: row.version,
    userId: row.userId,
    provenance: row.provenance as EvidenceProvenance,
    lifecycle: row.lifecycle as EvidenceLifecycle,
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

// Aliased handle onto personal_intelligence_claim_versions used only inside
// the correlated NOT EXISTS subquery in appendCorrection, so it reads as a
// distinct range table from the outer reference in the same statement -
// mirrors the exact "newer version" guard already proven in
// DrizzleEvidenceRepository.appendLifecycleVersion.
const newerClaimVersion = alias(personalIntelligenceClaimVersions, "newer_claim_version");

export class DrizzlePersonalIntelligenceClaimRepository
  implements PersonalIntelligenceClaimRepository
{
  constructor(private readonly db: DatabaseClient) {}

  async findClaimForUser(
    userId: string,
    claimId: string,
  ): Promise<PersonalIntelligenceClaim | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceClaims)
      .where(
        and(
          eq(personalIntelligenceClaims.id, claimId),
          eq(personalIntelligenceClaims.userId, userId),
        ),
      )
      .limit(1);

    return row ? toDomainClaim(row) : null;
  }

  async findClaimVersionForUser(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    const [row] = await this.db
      .select()
      .from(personalIntelligenceClaimVersions)
      .where(
        and(
          eq(personalIntelligenceClaimVersions.claimId, claimId),
          eq(personalIntelligenceClaimVersions.userId, userId),
          eq(personalIntelligenceClaimVersions.version, version),
        ),
      )
      .limit(1);

    return row ? toDomainVersion(row) : null;
  }

  // Returns every currently active version for the user, optionally scoped
  // to a claimType - deliberately unfiltered otherwise: multiple active
  // versions of the same claimType are legal and must remain jointly
  // observable so a future consumer can see contradictions, never a single
  // "resolved" claim. claimType lives on the parent claim identity row, not
  // on the version row itself, hence the join.
  async findActiveClaimVersionsForUser(
    userId: string,
    claimType?: PersonalIntelligenceClaimType,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    const rows = await this.db
      .select({
        id: personalIntelligenceClaimVersions.id,
        claimId: personalIntelligenceClaimVersions.claimId,
        version: personalIntelligenceClaimVersions.version,
        userId: personalIntelligenceClaimVersions.userId,
        valueKind: personalIntelligenceClaimVersions.valueKind,
        valueText: personalIntelligenceClaimVersions.valueText,
        provenance: personalIntelligenceClaimVersions.provenance,
        confidence: personalIntelligenceClaimVersions.confidence,
        lifecycle: personalIntelligenceClaimVersions.lifecycle,
        evidenceVersionId: personalIntelligenceClaimVersions.evidenceVersionId,
        inferenceId: personalIntelligenceClaimVersions.inferenceId,
        observedAt: personalIntelligenceClaimVersions.observedAt,
        acceptedAt: personalIntelligenceClaimVersions.acceptedAt,
        createdAt: personalIntelligenceClaimVersions.createdAt,
      })
      .from(personalIntelligenceClaimVersions)
      .innerJoin(
        personalIntelligenceClaims,
        eq(personalIntelligenceClaimVersions.claimId, personalIntelligenceClaims.id),
      )
      .where(
        and(
          eq(personalIntelligenceClaimVersions.userId, userId),
          eq(personalIntelligenceClaimVersions.lifecycle, "active"),
          claimType ? eq(personalIntelligenceClaims.claimType, claimType) : undefined,
        ),
      )
      .orderBy(asc(personalIntelligenceClaimVersions.createdAt));

    return rows.map(toDomainVersion);
  }

  // Creates the stable claim identity row plus its version 1 row, atomically.
  // If evidenceVersionId is null, the version insert is a plain, unconditional
  // insert (no ownership fact to verify). If evidenceVersionId is supplied,
  // the insert is sourced FROM evidence_versions filtered to
  // (id = evidenceVersionId AND user_id = userId) - the exact atomic
  // ownership-check pattern already proven in
  // DrizzlePersonalStateRepository.insertRevision. A mismatched/nonexistent
  // EvidenceVersion yields zero source rows, so nothing is inserted and the
  // whole transaction (including the claim identity row already inserted)
  // rolls back.
  async create(input: CreateClaimInput): Promise<PersonalIntelligenceClaimVersion> {
    return this.db.transaction(async (tx) => {
      await tx.insert(personalIntelligenceClaims).values({
        id: input.claimId,
        userId: input.userId,
        claimType: input.claimType,
        createdAt: input.now,
        updatedAt: input.now,
      });

      if (input.evidenceVersionId === null) {
        const [row] = await tx
          .insert(personalIntelligenceClaimVersions)
          .values({
            id: input.versionId,
            claimId: input.claimId,
            userId: input.userId,
            version: 1,
            valueKind: input.valueKind,
            valueText: input.valueText,
            provenance: input.provenance,
            confidence: input.confidence,
            lifecycle: "active",
            evidenceVersionId: null,
            // Additive, D3 - no write path sets this yet (see the model's
            // field-level comment); always null until a future,
            // separately-scoped promotion increment.
            inferenceId: null,
            observedAt: input.observedAt,
            acceptedAt: input.acceptedAt,
            createdAt: input.now,
          })
          .returning();

        if (!row) throw new Error("Failed to create personal intelligence claim");
        return toDomainVersion(row);
      }

      // Extracted to a local so TypeScript's null-narrowing (established by
      // the early return above) survives capture inside the nested query
      // builder closure below - narrowing a property access on `input`
      // itself does not persist across a closure boundary.
      const evidenceVersionId = input.evidenceVersionId;

      const [row] = await tx
        .insert(personalIntelligenceClaimVersions)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.versionId}`.as("id"),
              claimId: sql<string>`${input.claimId}`.as("claim_id"),
              userId: evidenceVersions.userId,
              version: sql<number>`1`.as("version"),
              valueKind: sql<string>`${input.valueKind}`.as("value_kind"),
              valueText: sql<string>`${input.valueText}`.as("value_text"),
              provenance: sql<string>`${input.provenance}`.as("provenance"),
              confidence: sql<number>`${input.confidence}`.as("confidence"),
              lifecycle: sql<string>`active`.as("lifecycle"),
              evidenceVersionId: evidenceVersions.id,
              // Additive, D3 - no write path sets this yet; always null.
              inferenceId: sql<string | null>`null`.as("inference_id"),
              observedAt: sql<Date>`${input.observedAt}`.as("observed_at"),
              acceptedAt: sql<Date>`${input.acceptedAt}`.as("accepted_at"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(evidenceVersions)
            .where(
              and(eq(evidenceVersions.id, evidenceVersionId), eq(evidenceVersions.userId, input.userId)),
            ),
        )
        .returning();

      if (!row) {
        throw new Error(
          "Cannot create personal intelligence claim: the referenced EvidenceVersion does not belong to the authenticated user",
        );
      }

      return toDomainVersion(row);
    });
  }

  // Appends exactly one new immutable version to an existing claim. Never
  // UPDATEs or DELETEs the previous version - the relationship between
  // versions is claimId + strictly increasing version, nothing else.
  //
  // Concurrency and ownership are both enforced by a single atomic
  // INSERT ... SELECT ... WHERE, mirroring DrizzleEvidenceRepository's
  // appendLifecycleVersion pattern:
  //   - the SELECT only produces a row when a version matching
  //     (claimId, userId, version = expectedVersion) currently exists;
  //   - the correlated NOT EXISTS additionally refuses to append when a
  //     version newer than expectedVersion already exists for this claim,
  //     so a stale expectedVersion is rejected outright rather than
  //     silently reinterpreted;
  //   - when evidenceVersionId is supplied, an additional correlated EXISTS
  //     against evidence_versions requires it to belong to the same user -
  //     the same ownership fact enforced in create(), expressed as an
  //     additional WHERE condition in the same atomic statement;
  //   - the existing unique(claimId, version) constraint is the final,
  //     database-enforced backstop against a race between two concurrent
  //     appendCorrection calls for the same expectedVersion.
  async appendCorrection(
    input: AppendClaimCorrectionInput,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    try {
      const [row] = await this.db
        .insert(personalIntelligenceClaimVersions)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.versionId}`.as("id"),
              claimId: personalIntelligenceClaimVersions.claimId,
              userId: personalIntelligenceClaimVersions.userId,
              version: sql<number>`${personalIntelligenceClaimVersions.version} + 1`.as("version"),
              valueKind: sql<string>`${input.valueKind}`.as("value_kind"),
              valueText: sql<string>`${input.valueText}`.as("value_text"),
              provenance: sql<string>`${input.provenance}`.as("provenance"),
              confidence: sql<number>`${input.confidence}`.as("confidence"),
              lifecycle: sql<string>`${input.lifecycle}`.as("lifecycle"),
              evidenceVersionId: sql<string | null>`${input.evidenceVersionId}`.as(
                "evidence_version_id",
              ),
              // Additive, D3 - no write path sets this yet; always null.
              // Correction never inherits the prior version's inferenceId
              // by this increment's scope (§H of the Contract).
              inferenceId: sql<string | null>`null`.as("inference_id"),
              observedAt: sql<Date>`${input.observedAt}`.as("observed_at"),
              acceptedAt: sql<Date>`${input.acceptedAt}`.as("accepted_at"),
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(personalIntelligenceClaimVersions)
            .where(
              and(
                eq(personalIntelligenceClaimVersions.claimId, input.claimId),
                eq(personalIntelligenceClaimVersions.userId, input.userId),
                eq(personalIntelligenceClaimVersions.version, input.expectedVersion),
                notExists(
                  qb
                    .select({ one: sql`1` })
                    .from(newerClaimVersion)
                    .where(
                      and(
                        eq(newerClaimVersion.claimId, input.claimId),
                        gt(newerClaimVersion.version, input.expectedVersion),
                      ),
                    ),
                ),
                input.evidenceVersionId
                  ? exists(
                      qb
                        .select({ one: sql`1` })
                        .from(evidenceVersions)
                        .where(
                          and(
                            eq(evidenceVersions.id, input.evidenceVersionId),
                            eq(evidenceVersions.userId, input.userId),
                          ),
                        ),
                    )
                  : undefined,
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

  // Read-only, IMPLEMENTATION_INCREMENT_PIC-D4-01
  // (docs/gates/PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md).
  // Returns every version row for this user - deliberately no lifecycle
  // filter, unlike findActiveClaimVersionsForUser above, so a consumer can
  // observe the full history (active, superseded, corrected, revoked,
  // disputed), not only the current state. `since`, when supplied,
  // excludes the reference row itself (strict greater-than) so repeated
  // polling with the last-seen createdAt never re-returns it.
  async findVersionsForUser(
    userId: string,
    since?: Date,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    const rows = await this.db
      .select()
      .from(personalIntelligenceClaimVersions)
      .where(
        and(
          eq(personalIntelligenceClaimVersions.userId, userId),
          since ? gt(personalIntelligenceClaimVersions.createdAt, since) : undefined,
        ),
      )
      .orderBy(asc(personalIntelligenceClaimVersions.createdAt));

    return rows.map(toDomainVersion);
  }

  // Read-only, IMPLEMENTATION_INCREMENT_PIC-D4-01. Resolves an
  // EvidenceVersion by its own id, scoped to the requesting user - the
  // same ownership fact already enforced inline in create() and
  // appendCorrection() above, exposed here as its own read for
  // inspectEvidence. Never writes to evidence_versions.
  async findEvidenceVersionForUser(
    userId: string,
    evidenceVersionId: string,
  ): Promise<EvidenceVersion | null> {
    const [row] = await this.db
      .select()
      .from(evidenceVersions)
      .where(and(eq(evidenceVersions.id, evidenceVersionId), eq(evidenceVersions.userId, userId)))
      .limit(1);

    return row ? toDomainEvidenceVersion(row) : null;
  }
}
