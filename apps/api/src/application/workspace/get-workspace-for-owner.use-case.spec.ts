import assert from "node:assert/strict";
import test from "node:test";
import type { Workspace } from "../../core/resource/workspace.model";
import type { WorkspaceRepository } from "../../core/resource/workspace.repository";
import { GetWorkspaceForOwnerUseCase } from "./get-workspace-for-owner.use-case";
import { WorkspaceNotFoundError } from "./errors/workspace-not-found.error";

const workspace: Workspace = {
  id: "workspace-1",
  ownerId: "owner-1",
  lifecycleState: "active",
  createdAt: new Date("2026-01-01T00:00:00.000Z"),
  updatedAt: new Date("2026-01-02T00:00:00.000Z"),
};

function createRepository(
  findForOwner: WorkspaceRepository["findForOwner"],
): WorkspaceRepository {
  return {
    findById: async () => undefined,
    findForOwner,
    transitionForOwner: async () => undefined,
  };
}

test("returns the owner-scoped workspace", async () => {
  let received: [string, string] | undefined;
  const repository = createRepository(async (workspaceId, ownerId) => {
    received = [workspaceId, ownerId];
    return workspace;
  });

  const useCase = new GetWorkspaceForOwnerUseCase(repository);
  const result = await useCase.execute({ workspaceId: "workspace-1", ownerId: "owner-1" });

  assert.deepEqual(result, workspace);
  assert.deepEqual(received, ["workspace-1", "owner-1"]);
});

test("converts a missing workspace into WorkspaceNotFoundError", async () => {
  const repository = createRepository(async () => undefined);
  const useCase = new GetWorkspaceForOwnerUseCase(repository);

  await assert.rejects(
    () => useCase.execute({ workspaceId: "workspace-1", ownerId: "owner-1" }),
    (error: unknown) => error instanceof WorkspaceNotFoundError,
  );
});

test("propagates unexpected repository failures", async () => {
  const failure = new Error("database unavailable");
  const repository = createRepository(async () => {
    throw failure;
  });
  const useCase = new GetWorkspaceForOwnerUseCase(repository);

  await assert.rejects(
    () => useCase.execute({ workspaceId: "workspace-1", ownerId: "owner-1" }),
    (error: unknown) => error === failure,
  );
});
