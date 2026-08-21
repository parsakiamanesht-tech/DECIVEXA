import type { ResourceReference } from "./resource.reference";
import type { ResourceResolutionStrategy } from "./resource.resolution";
import type { Workspace } from "./workspace.model";
import type { WorkspaceRepository } from "./workspace.repository";

export function createWorkspaceResolutionStrategy(
  repository: WorkspaceRepository,
): ResourceResolutionStrategy<Workspace> {
  return async (reference: ResourceReference) =>
    repository.findById(reference.resourceId);
}
