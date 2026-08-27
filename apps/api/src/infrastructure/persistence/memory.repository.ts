import { and, eq, gt, notExists, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { DatabaseClient } from "../../persistence/database";
import { memoryRecords, memoryRecordVersions } from "../../persistence/schema/memory.schema";
import type { MemoryRecord, MemoryRecordVersion } from "../../core/memory/memory-record.model";
import type {
  AppendMemoryLifecycleVersionInput,
  CreateMemoryRecordInput,
  DeleteMemoryRecordInput,
  MemoryRecordRepository,
} from "../../core/memory/memory-record.repository";

function toDomainRecord(row: typeof memoryRecords.$inferSelect): MemoryRecord {
  return {
    id: row.id,
    userId: row.userId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toDomainVersion(row: typeof memoryRecordVersions.$inferSelect): MemoryRecordVersion {
  return {
    id: row.id,
    recordId: row.recordId,
    version: row.version,
    userId: row.userId,
    provenance: row.provenance,
    lifecycle: row.lifecycle,
    observedAt: row.observedAt,
    acceptedAt: row.acceptedAt,
    confidence: row.confidence,
    valueKind: row.valueKind,
    value: row.value,
    userConfirmed: row.userConfirmed,
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

// Aliased handle onto memory_record_versions used only inside the correlated
// NOT EXISTS subquery below, so it reads as a distinct range table from the
// outer memory_record_versions reference in the same statement.
const newerVersion = alias(memoryRecordVersions, "newer_version");

export class DrizzleMemoryRecordRepository implements MemoryRecordRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByIdForUser(userId: string, id: string): Promise<MemoryRecord | null> {
    const [row] = await this.db
      .select()
      .from(memoryRecords)
      .where(and(eq(memoryRecords.id, id), eq(memoryRecords.userId, userId)))
      .limit(1);

    return row ? toDomainRecord(row) : null;
  }

  async findVersionForUser(
    userId: string,
    recordId: string,
    version: number,
  ): Promise<MemoryRecordVersion | null> {
    const [row] = await this.db
      .select()
      .from(memoryRecordVersions)
      .where(
        and(
          eq(memoryRecordVersions.recordId, recordId),
          eq(memoryRecordVersions.userId, userId),
          eq(memoryRecordVersions.version, version),
        ),
      )
      .limit(1);

    return row ? toDomainVersion(row) : null;
  }

  async create(input: CreateMemoryRecordInput): Promise<MemoryRecordVersion> {
    return this.db.transaction(async (tx) => {
      await tx.insert(memoryRecords).values({
        id: input.recordId,
        userId: input.userId,
        createdAt: input.now,
        updatedAt: input.now,
      });

      const [row] = await tx
        .insert(memoryRecordVersions)
        .values({
          id: input.versionId,
          recordId: input.recordId,
          version: 1,
          userId: input.userId,
          provenance: input.provenance,
          lifecycle: "active",
          observedAt: input.observedAt,
          acceptedAt: input.acceptedAt,
          confidence: input.confidence,
          valueKind: input.valueKind ?? null,
          value: input.value ?? null,
          // No confirmation workflow is authorized in this increment;
          // every created version is unconfirmed by construction,
          // matching the column's own default.
          userConfirmed: false,
          createdAt: input.now,
        })
        .returning();

      if (!row) throw new Error("Failed to create memory record version");
      return toDomainVersion(row);
    });
  }

  /**
   * Appends a new, immutable MemoryRecordVersion row. Never UPDATEs or
   * DELETEs an existing row - the previous version is left exactly as it
   * was, preserving history per the approved Contract.
   *
   * Concurrency safety is enforced by the database, not by a
   * read-then-compare-then-write in application code:
   *
   * - The INSERT ... SELECT only produces a candidate row when a row
   *   matching (recordId, userId, version = expectedVersion) actually
   *   exists right now - this is also where provenance/observedAt/
   *   acceptedAt/confidence are copied from, preserving the immutable
   *   append-only version model instead of re-deriving them.
   * - The correlated NOT EXISTS additionally refuses to append when a
   *   version newer than expectedVersion already exists for this record,
   *   so a stale (too old) expectedVersion can never create a gap or a
   *   branch in the history - it is rejected outright, never silently
   *   reinterpreted as "append after the true latest".
   * - The existing unique(recordId, version) constraint is the final,
   *   database-enforced backstop: if two concurrent requests both pass the
   *   WHERE/NOT EXISTS check for the same expectedVersion, only one INSERT
   *   can win; the other fails with a Postgres unique-violation (23505),
   *   caught below and translated into the same `null` conflict result the
   *   caller already expects, instead of throwing.
   *
   * The lifecycle value itself is constrained to active/corrected/deleted
   * by the database CHECK constraint established in Step 2; no additional
   * lifecycle state is introduced here.
   */
  async appendLifecycleVersion(
    input: AppendMemoryLifecycleVersionInput,
  ): Promise<MemoryRecordVersion | null> {
    try {
      const [row] = await this.db
        .insert(memoryRecordVersions)
        .select((qb) =>
          qb
            .select({
              id: sql<string>`${input.versionId}`.as("id"),
              recordId: memoryRecordVersions.recordId,
              userId: memoryRecordVersions.userId,
              version: sql<number>`${memoryRecordVersions.version} + 1`.as("version"),
              provenance: memoryRecordVersions.provenance,
              lifecycle: sql<string>`${input.lifecycle}`.as("lifecycle"),
              observedAt: memoryRecordVersions.observedAt,
              acceptedAt: memoryRecordVersions.acceptedAt,
              confidence: memoryRecordVersions.confidence,
              // Founder-authorized copy-forward semantics (Interpretation
              // X, Memory Schema Implementation Blocker Resolution,
              // Blocker 4): a lifecycle-only transition copies the value
              // slot and confirmation state forward unchanged, exactly as
              // provenance/confidence already are above. No value
              // mutation or confirmation-state change happens here.
              valueKind: memoryRecordVersions.valueKind,
              value: memoryRecordVersions.value,
              userConfirmed: memoryRecordVersions.userConfirmed,
              createdAt: sql<Date>`${input.now}`.as("created_at"),
            })
            .from(memoryRecordVersions)
            .where(
              and(
                eq(memoryRecordVersions.recordId, input.recordId),
                eq(memoryRecordVersions.userId, input.userId),
                eq(memoryRecordVersions.version, input.expectedVersion),
                notExists(
                  qb
                    .select({ one: sql`1` })
                    .from(newerVersion)
                    .where(
                      and(
                        eq(newerVersion.recordId, input.recordId),
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

  /**
   * Genuinely removes the record's readable content (Founder Build
   * Authorization, "IMPORTANT DELETION RULE") - distinct from
   * appendLifecycleVersion, which only ever copies the value slot
   * forward unchanged and is no longer accepted for "deleted" (see
   * MemoryUseCase.appendLifecycleVersion).
   *
   * Two steps inside one transaction:
   *
   * 1. Append a new version row exactly like appendLifecycleVersion's
   *    INSERT ... SELECT / optimistic-concurrency pattern (same
   *    expectedVersion + NOT EXISTS-newer-version guard, same
   *    unique-violation-as-conflict handling), except valueKind/value are
   *    explicitly NULL literals here, never copied forward from the
   *    prior version - this is the one intentional divergence from the
   *    copy-forward mechanism, and it exists specifically so the new
   *    "current" version carries no readable content.
   * 2. Null valueKind/value on every EXISTING version row for this
   *    record (an UPDATE across the whole version history) so no prior
   *    version retains readable content either - a soft-delete flag that
   *    leaves prior versions' content fully readable does not satisfy
   *    this requirement. Provenance, lifecycle, timestamps, and row
   *    existence are left untouched on those prior rows: the fact that a
   *    version existed, when, and under what provenance/lifecycle
   *    remains auditable - only the content itself is removed.
   *
   * If step 1 finds no matching row (wrong expectedVersion, wrong owner,
   * or a concurrent append already won), the whole transaction is rolled
   * back and null is returned - step 2 never runs against a record whose
   * deletion was not actually accepted, so no content is ever nulled
   * without a corresponding, real "deleted" version being recorded.
   */
  async deleteRecordContent(
    input: DeleteMemoryRecordInput,
  ): Promise<MemoryRecordVersion | null> {
    try {
      return await this.db.transaction(async (tx) => {
        const [row] = await tx
          .insert(memoryRecordVersions)
          .select((qb) =>
            qb
              .select({
                id: sql<string>`${input.versionId}`.as("id"),
                recordId: memoryRecordVersions.recordId,
                userId: memoryRecordVersions.userId,
                version: sql<number>`${memoryRecordVersions.version} + 1`.as("version"),
                provenance: memoryRecordVersions.provenance,
                lifecycle: sql<string>`'deleted'`.as("lifecycle"),
                observedAt: memoryRecordVersions.observedAt,
                acceptedAt: memoryRecordVersions.acceptedAt,
                confidence: memoryRecordVersions.confidence,
                // Deliberately NULL, never copied forward - this is the
                // one field pair where deletion diverges from
                // appendLifecycleVersion's copy-forward semantics.
                valueKind: sql<string | null>`null`.as("value_kind"),
                value: sql<string | null>`null`.as("value"),
                userConfirmed: memoryRecordVersions.userConfirmed,
                createdAt: sql<Date>`${input.now}`.as("created_at"),
              })
              .from(memoryRecordVersions)
              .where(
                and(
                  eq(memoryRecordVersions.recordId, input.recordId),
                  eq(memoryRecordVersions.userId, input.userId),
                  eq(memoryRecordVersions.version, input.expectedVersion),
                  notExists(
                    qb
                      .select({ one: sql`1` })
                      .from(newerVersion)
                      .where(
                        and(
                          eq(newerVersion.recordId, input.recordId),
                          gt(newerVersion.version, input.expectedVersion),
                        ),
                      ),
                  ),
                ),
              ),
          )
          .returning();

        if (!row) return null;

        // Step 2: purge content from every existing version row for this
        // record, including the one just inserted (a no-op for it, since
        // it was already inserted with NULL content) and every version
        // that predates it - genuine removal, not merely a new version
        // that happens to have no value while old ones still do.
        await tx
          .update(memoryRecordVersions)
          .set({ valueKind: null, value: null })
          .where(
            and(
              eq(memoryRecordVersions.recordId, input.recordId),
              eq(memoryRecordVersions.userId, input.userId),
            ),
          );

        return toDomainVersion(row);
      });
    } catch (error) {
      if (isUniqueViolation(error)) return null;
      throw error;
    }
  }
}
