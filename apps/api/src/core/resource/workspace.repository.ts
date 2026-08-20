import { and, eq } from "drizzle-orm";
import { createDatabase } from "../../persistence/database";
import { workspaces, type WorkspaceLifecycleState } from "./workspace.schema";

type DatabaseClient = ReturnType<typeof createDatabase>["client"];

export async function findWorkspaceById(
  db: DatabaseClient,
  workspaceId: string,
) {
  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, workspaceId))
    .limit(1);

  return workspace;
}

export async function findWorkspaceForOwner(
  db: DatabaseClient,
  workspaceId: string,
  ownerId: string,
) {
  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId)))
    .limit(1);

  return workspace;
}

export async function transitionWorkspaceForOwner(
  db: DatabaseClient,
  workspaceId: string,
  ownerId: string,
  from: WorkspaceLifecycleState,
  to: WorkspaceLifecycleState,
) {
  const [workspace] = await db
    .update(workspaces)
    .set({ lifecycleState: to })
    .where(
      and(
        eq(workspaces.id, workspaceId),
        eq(workspaces.ownerId, ownerId),
        eq(workspaces.lifecycleState, from),
      ),
    )
    .returning();

  return workspace;
}
