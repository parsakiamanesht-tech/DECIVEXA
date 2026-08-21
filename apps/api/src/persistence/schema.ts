import { users } from "./schema/identity.schema";
import { workspaces } from "./schema/workspace.schema";
import { personalStates } from "./schema/personal-state.schema";

export const DECIVEXA_SCHEMA = "decivexa" as const;

/**
 * Drizzle schema registry.
 *
 * Only approved Core/resource/module tables are registered here. Module-specific
 * tables require their own architecture and implementation gate. Personal State
 * is registered here only under the Founder-approved Increment 003 contract.
 */
export const persistenceSchema = {
  users,
  workspaces,
  personalStates,
} as const;
