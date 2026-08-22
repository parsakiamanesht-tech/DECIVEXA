import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { WORKSPACE_REPOSITORY } from "../core/resource/workspace.repository.token";
import { EVIDENCE_REPOSITORY } from "../core/evidence/evidence.repository.token";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../core/personal-intelligence/personal-intelligence-claim.repository.token";
import { DrizzleWorkspaceRepository } from "../infrastructure/persistence/workspace.repository";
import { DrizzleEvidenceRepository } from "../infrastructure/persistence/evidence.repository";
import { DrizzlePersonalIntelligenceClaimRepository } from "../infrastructure/persistence/personal-intelligence-claim.repository";
import { PersistenceModule } from "../infrastructure/persistence/persistence.module";
import { EvidenceModule } from "../infrastructure/evidence/evidence.module";
import { EvidenceUseCase } from "../application/evidence/evidence.use-case";
import type { DatabaseClient } from "../persistence/database";
import { DatabaseService } from "../persistence/database.service";

// EvidenceModule imports AuthModule, which constructs a real AccessTokenService;
// each node --test file runs in its own isolated process, so the env var set by
// access-token.service.spec.ts does not reach this file - set it here too,
// mirroring that same spec file's own convention.
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

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
    imports: [EvidenceModule],
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

void test("composition wires the personal intelligence claim repository port to the Drizzle adapter", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [PersistenceModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const repository = moduleRef.get(PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY);

  assert.ok(repository instanceof DrizzlePersonalIntelligenceClaimRepository);

  await moduleRef.close();
});
