import type { Workspace } from "./workspace.schema";

export type WorkspaceAccessAction = "read" | "write";

export function canAccessWorkspace(
  actorId: string,
  workspace: Pick<Workspace, "ownerId">,
  action: WorkspaceAccessAction,
): boolean {
  if (action !== "read" && action !== "write") {
    return false;
  }

  return actorId === workspace.ownerId;
}

export function assertWorkspaceAccess(
  actorId: string,
  workspace: Pick<Workspace, "ownerId">,
  action: WorkspaceAccessAction,
): void {
  if (!canAccessWorkspace(actorId, workspace, action)) {
    throw new Error("Workspace access denied");
  }
}
