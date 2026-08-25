import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import { AIRuntime } from "../ai/runtime/ai-runtime";
import { AIRuntimeController } from "../ai/runtime/ai-runtime.controller";
import { CapabilityRegistry } from "../ai/capability/capability-registry";
import { PERSONAL_STATE_INTERPRET_CAPABILITY } from "../ai/capability/personal-state-interpret.capability";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

// AppModule imports AuthModule, which constructs a real AccessTokenService;
// each node --test file runs in its own isolated process, so the env var
// set elsewhere does not reach this file - mirroring the existing
// application/personal-state/personal-state.app-composition.spec.ts
// convention.
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

test("the real application composition (AppModule) resolves AIRuntime and AIRuntimeController through the new AIRuntimeModule wiring, with exactly one capability registered", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const runtime = moduleRef.get(AIRuntime);
  const controller = moduleRef.get(AIRuntimeController);
  const capabilityRegistry = moduleRef.get(CapabilityRegistry);

  assert.ok(runtime instanceof AIRuntime);
  assert.ok(controller instanceof AIRuntimeController);
  assert.deepEqual(capabilityRegistry.get("personal-state.interpret"), PERSONAL_STATE_INTERPRET_CAPABILITY);

  await moduleRef.close();
});
