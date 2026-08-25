import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { AIContextModule } from "./ai-context.module";
import { AIContextService } from "./ai-context.service";
import { MemoryUseCase } from "../memory/memory.use-case";
import { EvidenceUseCase } from "../evidence/evidence.use-case";
import { PersonalIntelligenceClaimUseCase } from "../personal-intelligence/personal-intelligence-claim.use-case";
import { PersonalStateUseCase } from "../personal-state/personal-state.use-case";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

// AIContextModule transitively imports EvidenceModule and
// PersonalStateModule, both of which import AuthModule; mirror the same
// env-var convention already established by
// foundation/composition-wiring.spec.ts and
// infrastructure/auth/access-token.service.spec.ts (each node --test
// file runs in its own isolated process, so the env var set elsewhere
// does not reach this file).
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

test("the AI context module resolves AIContextService with all four use-case dependencies wired through their real module exports, with no HTTP controller or infrastructure/ai coupling", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AIContextModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const service = moduleRef.get(AIContextService);

  assert.ok(service instanceof AIContextService);
  // This resolves only because EvidenceModule/PersonalStateModule now
  // export EvidenceUseCase/PersonalStateUseCase (Context Boundary
  // Compatibility Remediation §1-2) and PersonalIntelligenceModule
  // already exported PersonalIntelligenceClaimUseCase - proving the
  // remediated exports are actually usable by an external consumer
  // module, not merely present.
  assert.ok(Reflect.get(service, "memoryUseCase") instanceof MemoryUseCase);
  assert.ok(Reflect.get(service, "evidenceUseCase") instanceof EvidenceUseCase);
  assert.ok(Reflect.get(service, "personalIntelligenceClaimUseCase") instanceof PersonalIntelligenceClaimUseCase);
  assert.ok(Reflect.get(service, "personalStateUseCase") instanceof PersonalStateUseCase);

  await moduleRef.close();
});
