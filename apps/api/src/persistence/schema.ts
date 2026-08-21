import { users } from "./schema/identity.schema";
import { workspaces } from "./schema/workspace.schema";
import { personalStates } from "./schema/personal-state.schema";

export const DECIVEXA_SCHEMA = "decivexa" as const;

export const persistenceSchema = {
  users,
  workspaces,
  personalStates,
} as const;
