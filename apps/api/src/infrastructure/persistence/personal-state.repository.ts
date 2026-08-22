import { and, asc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import type { DatabaseClient } from "../../persistence/database";
import { personalStates, personalStateRevisions } from "../../persistence/schema/personal-state.schema";
import { evidenceVersions } from "../../persistence/schema/evidence.schema";
import type { PersonalState, PersonalStateAvailability, PersonalStateProvenance } from "../../core/personal-state/personal-state.model";
import type { PersonalStateRevision } from "../../core/personal-state/personal-state-revision.model";
import type { PersonalStatePatch, PersonalStateRepository } from "../../core/personal-state/personal-state.repository";

// The tx object handed to db.transaction()'s callback - derived from
// DatabaseClient itself so this file never hardcodes drizzle-orm's internal
// transaction type.
type Tx = Parameters<Parameters<DatabaseClient["transaction"]>[0]>[0];

function toDomain(row: typeof personalStates.$inferSelect): PersonalState {
  return {
    id: row.id,
    userId: row.userId,
    timezone: row.timezone,
    locale: row.locale,
    availability: row.availability as PersonalStateAvailability | null,
    provenance: row.provenance as PersonalStateProvenance,
    revision: row.revision,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toDomainRevision(row: typeof personalStateRevisions.$inferSelect): PersonalStateRevision {
  return {
    id: row.id,
    userId: row.userId,
    revision: row.revision,
    timezone: row.timezone,
    locale: row.locale,
    availability: row.availability as PersonalStateAvailability | null,
    provenance: row.provenance as PersonalStateProvenance,
    evidenceVersionId: row.evidenceVersionId,
    createdAt: row.createdAt,
  };
}

type RevisionSnapshot = {
  userId: string;
  revision: number;
  timezone: string | null;
  locale: string | null;
  availability: PersonalStateAvailability | null;
  provenance: PersonalStateProvenance;
  createdAt: Date;
};

export class DrizzlePersonalStateRepository implements PersonalStateRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByUserId(userId: string): Promise<PersonalState | undefined> {
    const [row] = await this.db.select().from(personalStates).where(eq(personalStates.userId, userId)).limit(1);
    return row ? toDomain(row) : undefined;
  }

  async findRevisionsForUser(userId: string): Promise<PersonalStateRevision[]> {
    const rows = await this.db
      .select()
      .from(personalStateRevisions)
      .where(eq(personalStateRevisions.userId, userId))
      .orderBy(asc(personalStateRevisions.revision));
    return rows.map(toDomainRevision);
  }

  async create(input: {
    id: string; userId: string; timezone: string | null; locale: string | null;
    availability: PersonalStateAvailability | null; provenance: PersonalStateProvenance; now: Date;
    evidenceVersionId?: string | null;
  }): Promise<PersonalState> {
    return this.db.transaction(async (tx) => {
      const [row] = await tx.insert(personalStates).values({
        id: input.id,
        userId: input.userId,
        timezone: input.timezone,
        locale: input.locale,
        availability: input.availability,
        provenance: input.provenance,
        revision: 1,
        createdAt: input.now,
        updatedAt: input.now,
      }).returning();

      if (!row) throw new Error("Failed to create personal state");

      // Paired, same-transaction history capture: if this fails (including
      // the evidenceVersionId ownership check below), the personal_states
      // insert above is rolled back too - db.transaction() rolls back the
      // whole callback on any thrown error, exactly as already relied upon
      // by DrizzleEvidenceRepository.create.
      await this.insertRevision(
        tx,
        {
          userId: row.userId,
          revision: row.revision,
          timezone: row.timezone,
          locale: row.locale,
          availability: row.availability as PersonalStateAvailability | null,
          provenance: row.provenance as PersonalStateProvenance,
          createdAt: row.createdAt,
        },
        input.evidenceVersionId ?? null,
      );

      return toDomain(row);
    });
  }

  async updateForUser(
    userId: string,
    expectedRevision: number,
    patch: PersonalStatePatch,
    now: Date,
    evidenceVersionId?: string | null,
  ): Promise<PersonalState | undefined> {
    return this.db.transaction(async (tx) => {
      const [row] = await tx.update(personalStates).set({
        ...(patch.timezone !== undefined ? { timezone: patch.timezone } : {}),
        ...(patch.locale !== undefined ? { locale: patch.locale } : {}),
        ...(patch.availability !== undefined ? { availability: patch.availability } : {}),
        ...(patch.provenance !== undefined ? { provenance: patch.provenance } : {}),
        revision: sql`${personalStates.revision} + 1`,
        updatedAt: now,
      }).where(and(eq(personalStates.userId, userId), eq(personalStates.revision, expectedRevision))).returning();

      // Stale/absent revision: the existing optimistic-concurrency result is
      // unchanged - no history row, no further writes, transaction commits
      // with nothing to commit.
      if (!row) return undefined;

      await this.insertRevision(
        tx,
        {
          userId: row.userId,
          revision: row.revision,
          timezone: row.timezone,
          locale: row.locale,
          availability: row.availability as PersonalStateAvailability | null,
          provenance: row.provenance as PersonalStateProvenance,
          createdAt: row.updatedAt,
        },
        evidenceVersionId ?? null,
      );

      return toDomain(row);
    });
  }

  // Appends exactly one immutable personal_state_revisions row for the given
  // accepted-state snapshot. Never UPDATEs or DELETEs an existing row.
  //
  // - evidenceVersionId absent/null: a plain single-row insert with
  //   evidence_version_id = NULL - no ownership check needed.
  // - evidenceVersionId present: an atomic
  //   INSERT ... SELECT ... FROM evidence_versions WHERE id = ? AND user_id = ?
  //   - the same conditional-insert pattern DrizzleEvidenceRepository already
  //   uses. The referenced EvidenceVersion's own user_id is what is written
  //   as this row's user_id (which, by construction of the WHERE clause,
  //   only matches when it already equals the caller's userId) - the
  //   database FK to evidence_versions.id only proves the row exists, not
  //   that it is owned by this user; this atomic, ownership-filtered SELECT
  //   is what actually proves ownership. If no matching row exists (wrong
  //   owner, or the id simply does not exist), the SELECT produces nothing,
  //   the INSERT inserts nothing, and this throws to roll back the entire
  //   transaction - the caller never ends up with a personal_states mutation
  //   paired with a missing or cross-user revision.
  private async insertRevision(
    tx: Tx,
    snapshot: RevisionSnapshot,
    evidenceVersionId: string | null,
  ): Promise<void> {
    const id = randomUUID();

    if (evidenceVersionId === null) {
      await tx.insert(personalStateRevisions).values({
        id,
        userId: snapshot.userId,
        revision: snapshot.revision,
        timezone: snapshot.timezone,
        locale: snapshot.locale,
        availability: snapshot.availability,
        provenance: snapshot.provenance,
        evidenceVersionId: null,
        createdAt: snapshot.createdAt,
      });
      return;
    }

    const [row] = await tx
      .insert(personalStateRevisions)
      .select((qb) =>
        qb
          .select({
            id: sql<string>`${id}`.as("id"),
            userId: evidenceVersions.userId,
            revision: sql<number>`${snapshot.revision}`.as("revision"),
            timezone: sql<string | null>`${snapshot.timezone}`.as("timezone"),
            locale: sql<string | null>`${snapshot.locale}`.as("locale"),
            availability: sql<string | null>`${snapshot.availability}`.as("availability"),
            provenance: sql<string>`${snapshot.provenance}`.as("provenance"),
            evidenceVersionId: evidenceVersions.id,
            createdAt: sql<Date>`${snapshot.createdAt}`.as("created_at"),
          })
          .from(evidenceVersions)
          .where(and(eq(evidenceVersions.id, evidenceVersionId), eq(evidenceVersions.userId, snapshot.userId))),
      )
      .returning();

    if (!row) {
      throw new Error(
        "Cannot record personal state revision: the referenced EvidenceVersion does not belong to the authenticated user",
      );
    }
  }
}
