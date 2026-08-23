import type {
  MemoryLifecycle,
  MemoryProvenance,
  MemoryRecord,
  MemoryRecordVersion,
} from "./memory-record.model";

export type CreateMemoryRecordInput = Readonly<{
  recordId: string;
  versionId: string;
  userId: string;
  provenance: MemoryProvenance;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  now: Date;
}>;

export type AppendMemoryLifecycleVersionInput = Readonly<{
  userId: string;
  recordId: string;
  versionId: string;
  expectedVersion: number;
  lifecycle: MemoryLifecycle;
  now: Date;
}>;

export interface MemoryRecordRepository {
  findByIdForUser(userId: string, id: string): Promise<MemoryRecord | null>;
  findVersionForUser(
    userId: string,
    recordId: string,
    version: number,
  ): Promise<MemoryRecordVersion | null>;
  create(input: CreateMemoryRecordInput): Promise<MemoryRecordVersion>;
  appendLifecycleVersion(
    input: AppendMemoryLifecycleVersionInput,
  ): Promise<MemoryRecordVersion | null>;
}
