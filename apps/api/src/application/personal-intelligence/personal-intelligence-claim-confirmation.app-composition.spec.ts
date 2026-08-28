import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import { PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.repository.token";
import { DrizzlePersonalIntelligenceClaimConfirmationRepository } from "../../infrastructure/persistence/personal-intelligence-claim-confirmation.repository";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

// AppModule imports AuthModule, which constructs a real AccessTokenService;
// each node --test file runs in its own isolated process, so the env var set by
// access-token.service.spec.ts does not reach this file - set it here too,
// mirroring the existing composition-wiring.spec.ts convention.
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

// PIC Claim Ontology / Taxonomy Option 2, Claim User Confirmation (C3)
// (Implementation Increment Contract §3.3/§5). Unlike the sibling Claim
// and Inference repositories, no application-layer use-case sits above
// this repository by design - Contract §5 authorizes storage and
// derivation only, not a confirmation-triggering use-case/API/workflow.
// This test therefore verifies the repository token itself resolves
// through the real application composition, without a live database
// connection, rather than verifying it via an intervening use-case.
test("the real application composition (AppModule) resolves the personal intelligence claim confirmation repository to the real Drizzle adapter, without a live database", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const repository = moduleRef.get(PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_REPOSITORY);

  assert.ok(repository instanceof DrizzlePersonalIntelligenceClaimConfirmationRepository);

  await moduleRef.close();
});
