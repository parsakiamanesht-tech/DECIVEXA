import { and, eq, sql } from "drizzle-orm";
import type { DatabaseClient } from "../../persistence/database";
import { personalStates } from "../../persistence/schema/personal-state.schema";
import type { PersonalState, PersonalStateAvailability, PersonalStateProvenance } from "../../core/personal-state/personal-state.model";
import type { PersonalStatePatch, PersonalStateRepository } from "../../core/personal-state/personal-state.repository";

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

export class DrizzlePersonalStateRepository implements PersonalStateRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findByUserId(userId: string): Promise<PersonalState | undefined> {
    const [row] = await this.db.select().from(personalStates).where(eq(personalStates.userId, userId)).limit(1);
    return row ? toDomain(row) : undefined;
  }

  async create(input: {
    id: string; userId: string; timezone: string | null; locale: string | null;
    availability: PersonalStateAvailability | null; provenance: PersonalStateProvenance; now: Date;
  }): Promise<PersonalState> {
    const [row] = await this.db.insert(personalStates).values({
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
    return toDomain(row);
  }

  async updateForUser(userId: string, expectedRevision: number, patch: PersonalStatePatch, now: Date): Promise<PersonalState | undefined> {
    const [row] = await this.db.update(personalStates).set({
      ...(patch.timezone !== undefined ? { timezone: patch.timezone } : {}),
      ...(patch.locale !== undefined ? { locale: patch.locale } : {}),
      ...(patch.availability !== undefined ? { availability: patch.availability } : {}),
      ...(patch.provenance !== undefined ? { provenance: patch.provenance } : {}),
      revision: sql`${personalStates.revision} + 1`,
      updatedAt: now,
    }).where(and(eq(personalStates.userId, userId), eq(personalStates.revision, expectedRevision))).returning();
    return row ? toDomain(row) : undefined;
  }
}
