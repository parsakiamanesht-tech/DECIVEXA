import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { RequestContext } from "../../context/request-context";
import type {
  MemoryLifecycle,
  MemoryProvenance,
  MemoryRecord,
  MemoryRecordVersion,
} from "../../core/memory/memory-record.model";
import { MEMORY_RECORD_REPOSITORY } from "../../core/memory/memory-record.repository.token";
import type { MemoryRecordRepository } from "../../core/memory/memory-record.repository";
import { failure, success, type Result } from "../../shared/result/result";

export type MemoryCreateInput = Readonly<{
  provenance: MemoryProvenance;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
}>;

export type MemoryLifecycleAppendInput = Readonly<{
  recordId: string;
  expectedVersion: number;
  lifecycle: MemoryLifecycle;
}>;

export class MemoryValidationError extends Error {}
export class MemoryConflictError extends Error {}
export class MemoryNotFoundError extends Error {}

@Injectable()
export class MemoryUseCase {
  constructor(
    @Inject(MEMORY_RECORD_REPOSITORY) private readonly repository: MemoryRecordRepository,
  ) {}

  async get(recordId: string, context: RequestContext): Promise<Result<MemoryRecord>> {
    if (!context.userId) return failure(new MemoryValidationError("Authenticated user required"));
    const record = await this.repository.findByIdForUser(context.userId, recordId);
    if (!record) return failure(new MemoryNotFoundError("Memory record not found"));
    return success(record);
  }

  async getVersion(
    recordId: string,
    version: number,
    context: RequestContext,
  ): Promise<Result<MemoryRecordVersion>> {
    if (!context.userId) return failure(new MemoryValidationError("Authenticated user required"));
    if (!Number.isInteger(version) || version < 1) {
      return failure(new MemoryValidationError("Invalid version"));
    }
    const found = await this.repository.findVersionForUser(context.userId, recordId, version);
    if (!found) return failure(new MemoryNotFoundError("Memory record version not found"));
    return success(found);
  }

  async create(input: MemoryCreateInput, context: RequestContext): Promise<Result<MemoryRecordVersion>> {
    if (!context.userId) return failure(new MemoryValidationError("Authenticated user required"));
    try {
      const version = await this.repository.create({
        recordId: randomUUID(),
        versionId: randomUUID(),
        userId: context.userId,
        provenance: input.provenance,
        observedAt: input.observedAt,
        acceptedAt: input.acceptedAt,
        confidence: input.confidence,
        now: new Date(),
      });
      return success(version);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error("Invalid memory record"));
    }
  }

  async appendLifecycleVersion(
    input: MemoryLifecycleAppendInput,
    context: RequestContext,
  ): Promise<Result<MemoryRecordVersion>> {
    if (!context.userId) return failure(new MemoryValidationError("Authenticated user required"));
    if (!Number.isInteger(input.expectedVersion) || input.expectedVersion < 1) {
      return failure(new MemoryValidationError("Invalid expectedVersion"));
    }
    try {
      const version = await this.repository.appendLifecycleVersion({
        userId: context.userId,
        recordId: input.recordId,
        versionId: randomUUID(),
        expectedVersion: input.expectedVersion,
        lifecycle: input.lifecycle,
        now: new Date(),
      });
      if (!version) return failure(new MemoryConflictError("Version conflict or memory record not found"));
      return success(version);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error("Invalid memory lifecycle transition"));
    }
  }
}
