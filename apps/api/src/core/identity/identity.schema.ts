import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { DECIVEXA_SCHEMA } from "../../persistence/schema";

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => ({
    schema: DECIVEXA_SCHEMA,
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
