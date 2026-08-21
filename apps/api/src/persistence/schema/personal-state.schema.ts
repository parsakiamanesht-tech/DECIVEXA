import { pgSchema, integer, text, timestamp, uniqueIndex, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./identity.schema";

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

export type PersonalStateRow = typeof personalStates.$inferSelect;
export type NewPersonalStateRow = typeof personalStates.$inferInsert;
