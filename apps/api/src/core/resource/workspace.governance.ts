import { assertWorkspaceAccess } from "./workspace.access";
import { archiveWorkspace, restoreWorkspace } from "./workspace.lifecycle";
import type { WorkspaceRepository } from "./workspace.repository";
import type { WorkspaceLifecycleState } from "./workspace.model";

export async function getWorkspaceForActor(
  repository: WorkspaceRepository,
  actorId: string,
  workspaceId: string,
) {
  const workspace = await repository.findForOwner(workspaceId, actorId);

  if (!workspace) {
    throw new Error("Workspace access denied");
  }

  assertWorkspaceAccess(actorId, workspace, "read");
  return workspace;
}

export async function archiveWorkspaceForActor(
  repository: WorkspaceRepository,
  actorId: string,
  workspaceId: string,
) {
  const workspace = await repository.findForOwner(workspaceId, actorId);

  if (!workspace) {
    throw new Error("Workspace access denied");
  }

  assertWorkspaceAccess(actorId, workspace, "write");
  const nextState = archiveWorkspace(workspace.lifecycleState);

  return repository.transitionForOwner(
    workspaceId,
    actorId,
    workspace.lifecycleState,
    nextState,
  );
}

export async function restoreWorkspaceForActor(
  repository: WorkspaceRepository,
  actorId: string,
  workspaceId: string,
) {
  const workspace = await repository.findForOwner(workspaceId, actorId);

  if (!workspace) {
    throw new Error("Workspace access denied");
  }

  assertWorkspaceAccess(actorId, workspace, "write");
  const nextState = restoreWorkspace(workspace.lifecycleState);

  return repository.transitionForOwner(
    workspaceId,
    actorId,
    workspace.lifecycleState,
    nextState,
  );
}

export function isWorkspaceLifecycleState(value: string): value is WorkspaceLifecycleState {
  return value === "active" || value === "archived";
}
