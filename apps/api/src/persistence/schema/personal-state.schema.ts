import { pgSchema, integer, text, timestamp, uniqueIndex, check, foreignKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./identity.schema";
import { evidenceVersions } from "./evidence.schema";

const decivexa = pgSchema("decivexa");

export const personalStates = decivexa.table(
  "personal_states",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    timezone: text("timezone"),
    locale: text("locale"),
    availability: text("availability"),
    provenance: text("provenance").notNull().default("declared"),
    revision: integer("revision").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_states_user_id_unique").on(table.userId),
    check("personal_states_availability_check", sql`${table.availability} is null or ${table.availability} in ('available','limited','unavailable')`),
    check("personal_states_provenance_check", sql`${table.provenance} in ('declared','observed')`),
    check("personal_states_revision_check", sql`${table.revision} >= 1`),
  ],
);

// Immutable, append-only historical record of each accepted PersonalState.
// One row is written per successful create/update, in the same transaction
// as the corresponding personal_states write - never updated, never deleted.
export const personalStateRevisions = decivexa.table(
  "personal_state_revisions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    revision: integer("revision").notNull(),
    timezone: text("timezone"),
    locale: text("locale"),
    availability: text("availability"),
    provenance: text("provenance").notNull(),
    // Optional lineage to the EvidenceVersion that supports this accepted
    // state. Single-column FK to evidence_versions' existing primary key -
    // ownership (that the referenced EvidenceVersion belongs to the same
    // user) is enforced at write time in the repository via an atomic
    // INSERT ... SELECT ... WHERE pattern, not by a database constraint.
    evidenceVersionId: text("evidence_version_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("personal_state_revisions_user_id_revision_unique").on(table.userId, table.revision),
    check(
      "personal_state_revisions_availability_check",
      sql`${table.availability} is null or ${table.availability} in ('available','limited','unavailable')`,
    ),
    check("personal_state_revisions_provenance_check", sql`${table.provenance} in ('declared','observed')`),
    check("personal_state_revisions_revision_check", sql`${table.revision} >= 1`),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [personalStates.userId],
      name: "personal_state_revisions_state_owner_fk",
    }).onDelete("restrict"),
    foreignKey({
      columns: [table.evidenceVersionId],
      foreignColumns: [evidenceVersions.id],
      name: "personal_state_revisions_evidence_version_fk",
    }).onDelete("restrict"),
  ],
);

export type PersonalStateRow = typeof personalStates.$inferSelect;
export type NewPersonalStateRow = typeof personalStates.$inferInsert;
export type PersonalStateRevisionRow = typeof personalStateRevisions.$inferSelect;
export type NewPersonalStateRevisionRow = typeof personalStateRevisions.$inferInsert;
