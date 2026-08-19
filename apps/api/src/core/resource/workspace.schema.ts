import { pgSchema, text, timestamp, check, sql } from "drizzle-orm/pg-core";
import { users } from "../identity/identity.schema";

const decivexa = pgSchema("decivexa");

export const WORKSPACE_LIFECYCLE_STATES = ["active", "archived"] as const;
export type WorkspaceLifecycleState = (typeof WORKSPACE_LIFECYCLE_STATES)[number];

export const workspaces = decivexa.table(
  "workspaces",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    lifecycleState: text("lifecycle_state")
      .$type<WorkspaceLifecycleState>()
      .notNull()
      .default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    check(
      "workspaces_lifecycle_state_check",
      sql`${table.lifecycleState} in ('active', 'archived')`,
    ),
  ],
);

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
