import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import { PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-relationship-confirmation.repository.token";
import { DrizzlePersonalIntelligenceRelationshipConfirmationRepository } from "../../infrastructure/persistence/personal-intelligence-relationship-confirmation.repository";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

// AppModule imports AuthModule, which constructs a real AccessTokenService;
// each node --test file runs in its own isolated process, so the env var set by
// access-token.service.spec.ts does not reach this file - set it here too,
// mirroring the existing composition-wiring.spec.ts convention.
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

// Cross-Claim Matching — Matching-Hypothesis Confirmation (Implementation
// Increment Contract §15, docs/gates/
// PERSONAL-INTELLIGENCE-MATCHING-HYPOTHESIS-CONFIRMATION-IMPLEMENTATION-INCREMENT-CONTRACT.md).
// Like C3 Claim Confirmation and Relationship Evidence, no
// application-layer use-case sits above the repository by design - the
// Contract authorizes storage only, not a use-case/API/workflow. This
// test therefore verifies the repository token resolves through the
// real application composition, without a live database connection,
// mirroring personal-intelligence-relationship.app-composition.spec.ts
// exactly.
test("the real application composition (AppModule) resolves the personal intelligence relationship confirmation repository to the real Drizzle adapter, without a live database", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const repository = moduleRef.get(PERSONAL_INTELLIGENCE_RELATIONSHIP_CONFIRMATION_REPOSITORY);

  assert.ok(repository instanceof DrizzlePersonalIntelligenceRelationshipConfirmationRepository);

  await moduleRef.close();
});
