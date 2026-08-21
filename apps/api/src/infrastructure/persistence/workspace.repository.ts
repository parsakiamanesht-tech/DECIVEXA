import { and, eq } from "drizzle-orm";
import type { DatabaseClient } from "../../../persistence/database";
import { workspaces } from "../../../persistence/schema/workspace.schema";
import type { Workspace, WorkspaceLifecycleState } from "../../../core/resource/workspace.model";
import type { WorkspaceRepository } from "../../../core/resource/workspace.repository";

function toDomainWorkspace(row: typeof workspaces.$inferSelect): Workspace {
  return {
    id: row.id,
    ownerId: row.ownerId,
    lifecycleState: row.lifecycleState as WorkspaceLifecycleState,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export class DrizzleWorkspaceRepository implements WorkspaceRepository {
  constructor(private readonly db: DatabaseClient) {}

  async findById(workspaceId: string): Promise<Workspace | undefined> {
    const [workspace] = await this.db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1);

    return workspace ? toDomainWorkspace(workspace) : undefined;
  }

  async findForOwner(
    workspaceId: string,
    ownerId: string,
  ): Promise<Workspace | undefined> {
    const [workspace] = await this.db
      .select()
      .from(workspaces)
      .where(and(eq(workspaces.id, workspaceId), eq(workspaces.ownerId, ownerId)))
      .limit(1);

    return workspace ? toDomainWorkspace(workspace) : undefined;
  }

  async transitionForOwner(
    workspaceId: string,
    ownerId: string,
    from: WorkspaceLifecycleState,
    to: WorkspaceLifecycleState,
  ): Promise<Workspace | undefined> {
    const [workspace] = await this.db
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

    return workspace ? toDomainWorkspace(workspace) : undefined;
  }
}
