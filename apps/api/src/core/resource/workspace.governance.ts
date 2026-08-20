import { assertWorkspaceAccess } from "./workspace.access";
import { archiveWorkspace, restoreWorkspace } from "./workspace.lifecycle";
import {
  findWorkspaceForOwner,
  transitionWorkspaceForOwner,
} from "./workspace.repository";
import type { WorkspaceLifecycleState } from "./workspace.schema";
import { createDatabase } from "../../persistence/database";

type DatabaseClient = ReturnType<typeof createDatabase>["client"];

export async function getWorkspaceForActor(
  db: DatabaseClient,
  actorId: string,
  workspaceId: string,
) {
  const workspace = await findWorkspaceForOwner(db, workspaceId, actorId);

  if (!workspace) {
    throw new Error("Workspace access denied");
  }

  assertWorkspaceAccess(actorId, workspace, "read");
  return workspace;
}

export async function archiveWorkspaceForActor(
  db: DatabaseClient,
  actorId: string,
  workspaceId: string,
) {
  const workspace = await findWorkspaceForOwner(db, workspaceId, actorId);

  if (!workspace) {
    throw new Error("Workspace access denied");
  }

  assertWorkspaceAccess(actorId, workspace, "write");
  const nextState = archiveWorkspace(workspace.lifecycleState);

  return transitionWorkspaceForOwner(
    db,
    workspaceId,
    actorId,
    workspace.lifecycleState,
    nextState,
  );
}

export async function restoreWorkspaceForActor(
  db: DatabaseClient,
  actorId: string,
  workspaceId: string,
) {
  const workspace = await findWorkspaceForOwner(db, workspaceId, actorId);

  if (!workspace) {
    throw new Error("Workspace access denied");
  }

  assertWorkspaceAccess(actorId, workspace, "write");
  const nextState = restoreWorkspace(workspace.lifecycleState);

  return transitionWorkspaceForOwner(
    db,
    workspaceId,
    actorId,
    workspace.lifecycleState,
    nextState,
  );
}

export function isWorkspaceLifecycleState(value: string): value is WorkspaceLifecycleState {
  return value === "active" || value === "archived";
}
