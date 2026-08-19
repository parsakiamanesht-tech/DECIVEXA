import { pgSchema, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../identity/identity.schema";

const decivexa = pgSchema("decivexa");

export const workspaces = decivexa.table("workspaces", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
