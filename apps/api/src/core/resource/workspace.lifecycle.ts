import type { WorkspaceLifecycleState } from "./workspace.schema";

export function archiveWorkspace(state: WorkspaceLifecycleState): "archived" {
  if (state !== "active") {
    throw new Error("Only an active workspace can be archived");
  }

  return "archived";
}

export function restoreWorkspace(state: WorkspaceLifecycleState): "active" {
  if (state !== "archived") {
    throw new Error("Only an archived workspace can be restored");
  }

  return "active";
}
