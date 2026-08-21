import { users } from "./schema/identity.schema";
import { workspaces } from "./schema/workspace.schema";

export const DECIVEXA_SCHEMA = "decivexa" as const;

/**
 * Drizzle schema registry.
 *
 * Only approved Core/resource tables are registered here. Module-specific
 * tables require their own architecture and implementation gate.
 */
export const persistenceSchema = {
  users,
  workspaces,
} as const;
