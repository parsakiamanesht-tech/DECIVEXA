import type { Workspace, WorkspaceLifecycleState } from "./workspace.model";

export interface WorkspaceRepository {
  findById(workspaceId: string): Promise<Workspace | undefined>;

  findForOwner(workspaceId: string, ownerId: string): Promise<Workspace | undefined>;

  transitionForOwner(
    workspaceId: string,
    ownerId: string,
    from: WorkspaceLifecycleState,
    to: WorkspaceLifecycleState,
  ): Promise<Workspace | undefined>;
}
