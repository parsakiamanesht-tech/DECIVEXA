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

test("the real application composition (AppModule) resolves the personal intelligence claim use case through the existing repository binding", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const useCase = moduleRef.get(PersonalIntelligenceClaimUseCase);
  const repository = Reflect.get(useCase, "repository");
  const tokenBinding = moduleRef.get(PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY);

  assert.ok(useCase instanceof PersonalIntelligenceClaimUseCase);
  assert.ok(repository instanceof DrizzlePersonalIntelligenceClaimRepository);
  assert.ok(tokenBinding instanceof DrizzlePersonalIntelligenceClaimRepository);
  assert.strictEqual(repository, tokenBinding);

  await moduleRef.close();
});
