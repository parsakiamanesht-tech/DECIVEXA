import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { ApplicationModule } from "../application.module";
import { WORKSPACE_REPOSITORY } from "../../core/resource/workspace.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { PersistenceModule } from "../../infrastructure/persistence/persistence.module";
import { DrizzleWorkspaceRepository } from "../../infrastructure/persistence/workspace.repository";
import { GetWorkspaceForOwnerUseCase } from "./get-workspace-for-owner.use-case";

test("resolves the application use case through the real repository binding", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [ApplicationModule.register([PersistenceModule])],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} })
    .compile();

  const useCase = moduleRef.get(GetWorkspaceForOwnerUseCase);
  const repository = Reflect.get(useCase, "repository");
  const tokenBinding = moduleRef.get(WORKSPACE_REPOSITORY);

  assert.ok(useCase instanceof GetWorkspaceForOwnerUseCase);
  assert.ok(repository instanceof DrizzleWorkspaceRepository);
  assert.strictEqual(repository, tokenBinding);

  await moduleRef.close();
});
