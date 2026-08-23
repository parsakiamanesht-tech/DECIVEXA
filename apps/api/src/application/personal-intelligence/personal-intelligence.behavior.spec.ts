import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import { PersonalIntelligenceClaimUseCase } from "./personal-intelligence-claim.use-case";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import { DrizzlePersonalIntelligenceClaimRepository } from "../../infrastructure/persistence/personal-intelligence-claim.repository";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

// AppModule imports AuthModule, which constructs a real AccessTokenService;
// each node --test file runs in its own isolated process, so the env var set by
// access-token.service.spec.ts does not reach this file - set it here too,
// mirroring the existing composition-wiring.spec.ts convention.
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

test("the personal intelligence claim use case delegates to the repository binding supplied by the real application composition, without a live database", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const useCase = moduleRef.get(PersonalIntelligenceClaimUseCase);
  const repositoryVisibleToUseCase = Reflect.get(useCase, "repository");
  const repositoryFromApplicationGraph = moduleRef.get(PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY);

  // C / F: resolved through NestJS DI, never constructed manually.
  assert.ok(useCase instanceof PersonalIntelligenceClaimUseCase);

  // D: the repository token resolves to the real adapter.
  assert.ok(repositoryFromApplicationGraph instanceof DrizzlePersonalIntelligenceClaimRepository);

  // B / E: the use case's own repository dependency is the exact binding
  // supplied by the application's persistence graph (PersonalIntelligenceModule
  // reachable through AppModule, not a second/fake provider).
  assert.ok(repositoryVisibleToUseCase instanceof DrizzlePersonalIntelligenceClaimRepository);
  assert.strictEqual(repositoryVisibleToUseCase, repositoryFromApplicationGraph);

  // A / G: AppModule compiled above with DatabaseService overridden -
  // no live PostgreSQL connection was required to reach this point.
  await moduleRef.close();
});
