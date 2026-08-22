import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { WORKSPACE_REPOSITORY } from "../core/resource/workspace.repository.token";
import { EVIDENCE_REPOSITORY } from "../core/evidence/evidence.repository.token";
import { DrizzleWorkspaceRepository } from "../infrastructure/persistence/workspace.repository";
import { DrizzleEvidenceRepository } from "../infrastructure/persistence/evidence.repository";
import { PersistenceModule } from "../infrastructure/persistence/persistence.module";
import { EvidenceUseCase } from "../application/evidence/evidence.use-case";
import type { DatabaseClient } from "../persistence/database";
import { DatabaseService } from "../persistence/database.service";

void test("composition wires the workspace repository port to the Drizzle adapter", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [PersistenceModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const repository = moduleRef.get(WORKSPACE_REPOSITORY);

  assert.ok(repository instanceof DrizzleWorkspaceRepository);

  await moduleRef.close();
});

void test("composition wires the evidence repository port to the Drizzle adapter", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [PersistenceModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const repository = moduleRef.get(EVIDENCE_REPOSITORY);
  const useCase = moduleRef.get(EvidenceUseCase);
  const injectedRepository = Reflect.get(useCase, "repository");

  assert.ok(repository instanceof DrizzleEvidenceRepository);
  assert.ok(useCase instanceof EvidenceUseCase);
  assert.strictEqual(injectedRepository, repository);

  await moduleRef.close();
});
