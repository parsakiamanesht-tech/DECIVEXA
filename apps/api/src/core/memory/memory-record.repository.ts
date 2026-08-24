import type {
  MemoryLifecycle,
  MemoryProvenance,
  MemoryRecord,
  MemoryRecordVersion,
  MemoryValueKind,
} from "./memory-record.model";

export type CreateMemoryRecordInput = Readonly<{
  recordId: string;
  versionId: string;
  userId: string;
  provenance: MemoryProvenance;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  // Unified content/reference value (Decision B); both nullable - a
  // Memory may be created with no value at all. Omitting either defaults
  // to null. `userConfirmed` is not accepted here: no confirmation
  // workflow is authorized in this increment, so every created version is
  // unconfirmed by construction (see MemoryUseCase.create).
  valueKind?: MemoryValueKind | null;
  value?: string | null;
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
