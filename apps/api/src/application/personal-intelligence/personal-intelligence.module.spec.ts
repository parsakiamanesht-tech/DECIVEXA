import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { PersonalIntelligenceModule } from "./personal-intelligence.module";
import { PersonalIntelligenceClaimUseCase } from "./personal-intelligence-claim.use-case";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import { DrizzlePersonalIntelligenceClaimRepository } from "../../infrastructure/persistence/personal-intelligence-claim.repository";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

test("the personal intelligence feature module resolves the application use case through the real repository binding, with no HTTP controller involved", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [PersonalIntelligenceModule],
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
