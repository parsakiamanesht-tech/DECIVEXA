import { Module } from "@nestjs/common";
import { MEMORY_RECORD_REPOSITORY } from "../../core/memory/memory-record.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { DrizzleMemoryRecordRepository } from "../../infrastructure/persistence/memory.repository";
import { MemoryUseCase } from "./memory.use-case";

@Module({
  providers: [
    DatabaseService,
    MemoryUseCase,
    {
      provide: MEMORY_RECORD_REPOSITORY,
      useFactory: (database: DatabaseService) => new DrizzleMemoryRecordRepository(database.client),
      inject: [DatabaseService],
    },
  ],
  exports: [MemoryUseCase],
})
export class MemoryModule {}
