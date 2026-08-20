import type { ResourceReference } from "./resource.reference";
import { findWorkspaceById } from "./workspace.repository";
import type { Workspace } from "./workspace.schema";
import type { ResourceResolutionStrategy } from "./resource.resolution";

type WorkspaceDatabase = Parameters<typeof findWorkspaceById>[0];

export function createWorkspaceResolutionStrategy(
  db: WorkspaceDatabase,
): ResourceResolutionStrategy<Workspace> {
  return async (reference: ResourceReference) =>
    findWorkspaceById(db, reference.resourceId);
}
