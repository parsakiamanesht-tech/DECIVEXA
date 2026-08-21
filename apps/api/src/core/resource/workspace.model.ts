export const WORKSPACE_LIFECYCLE_STATES = ["active", "archived"] as const;

export type WorkspaceLifecycleState = (typeof WORKSPACE_LIFECYCLE_STATES)[number];

export interface Workspace {
  readonly id: string;
  readonly ownerId: string;
  readonly lifecycleState: WorkspaceLifecycleState;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
