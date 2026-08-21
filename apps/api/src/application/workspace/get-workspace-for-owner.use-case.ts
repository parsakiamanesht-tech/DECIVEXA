import { Inject, Injectable } from "@nestjs/common";
import type { Workspace } from "../../core/resource/workspace.model";
import type { WorkspaceRepository } from "../../core/resource/workspace.repository";
import { WORKSPACE_REPOSITORY } from "../../core/resource/workspace.repository.token";
import { WorkspaceNotFoundError } from "./errors/workspace-not-found.error";

export interface GetWorkspaceForOwnerInput {
  readonly workspaceId: string;
  readonly ownerId: string;
}

@Injectable()
export class GetWorkspaceForOwnerUseCase {
  constructor(
    @Inject(WORKSPACE_REPOSITORY)
    private readonly repository: WorkspaceRepository,
  ) {}

  async execute({ workspaceId, ownerId }: GetWorkspaceForOwnerInput): Promise<Workspace> {
    const workspace = await this.repository.findForOwner(workspaceId, ownerId);

    if (!workspace) {
      throw new WorkspaceNotFoundError();
    }

    return workspace;
  }
}
