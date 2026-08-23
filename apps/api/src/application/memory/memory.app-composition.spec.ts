import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import { MemoryModule } from "./memory.module";
import { MemoryUseCase } from "./memory.use-case";
import { MEMORY_RECORD_REPOSITORY } from "../../core/memory/memory-record.repository.token";
import { DrizzleMemoryRecordRepository } from "../../infrastructure/persistence/memory.repository";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

// AppModule imports AuthModule, which constructs a real AccessTokenService;
// each node --test file runs in its own isolated process, so the env var set by
// access-token.service.spec.ts does not reach this file - set it here too,
// mirroring the existing composition-wiring.spec.ts convention.
process.env.AUTH_TOKEN_SECRET ??= "decivexa-test-auth-token-secret-0123456789";

// NOTE: Step 6 does not authorize registering MemoryModule inside AppModule
// (apps/api/src/app.module.ts) - that wiring is explicitly deferred to a
// later step. This test therefore verifies what Step 6 can actually
// establish: that MemoryModule composes validly *alongside* the real,
// current application composition (no provider/token conflicts, no
// circular dependency) rather than asserting it is already reachable
// *through* AppModule the way the existing personal-intelligence
// app-composition test does for a module that is already registered there.
test("MemoryModule composes validly alongside the real application composition (AppModule), with no HTTP controller involved", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule, MemoryModule],
  })
    .overrideProvider(DatabaseService)
    .useValue({ client: {} as DatabaseClient })
    .compile();

  const useCase = moduleRef.get(MemoryUseCase);
  const repository = Reflect.get(useCase, "repository");
  const tokenBinding = moduleRef.get(MEMORY_RECORD_REPOSITORY);

  assert.ok(useCase instanceof MemoryUseCase);
  assert.ok(repository instanceof DrizzleMemoryRecordRepository);
  assert.ok(tokenBinding instanceof DrizzleMemoryRecordRepository);
  assert.strictEqual(repository, tokenBinding);

  await moduleRef.close();
});
