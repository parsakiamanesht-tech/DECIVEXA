import { users } from "../core/identity/identity.schema";

export const DECIVEXA_SCHEMA = "decivexa" as const;

/**
 * Drizzle schema registry.
 *
 * Only approved Core tables are registered here. Module-specific tables
 * require their own architecture and implementation gate.
 */
export const persistenceSchema = {
  users,
} as const;
