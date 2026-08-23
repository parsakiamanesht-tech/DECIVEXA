import assert from "node:assert/strict";
import test from "node:test";
import { Test } from "@nestjs/testing";
import { MemoryModule } from "./memory.module";
import { MemoryUseCase } from "./memory.use-case";
import { MEMORY_RECORD_REPOSITORY } from "../../core/memory/memory-record.repository.token";
import { DrizzleMemoryRecordRepository } from "../../infrastructure/persistence/memory.repository";
import type { DatabaseClient } from "../../persistence/database";
import { DatabaseService } from "../../persistence/database.service";

test("the memory feature module resolves the application use case through the real repository binding, with no HTTP controller involved", async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [MemoryModule],
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
