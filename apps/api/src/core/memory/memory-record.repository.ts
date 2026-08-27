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

// Genuine-deletion contract (Founder Build Authorization, "IMPORTANT
// DELETION RULE"): distinct from AppendMemoryLifecycleVersionInput because
// deletion is a different operation from a lifecycle-only transition. It
// carries no value/valueKind field to accept, because the whole point is
// that the implementation - never the caller - nulls the content; there is
// nothing for a caller to (mis)supply here.
export type DeleteMemoryRecordInput = Readonly<{
  userId: string;
  recordId: string;
  versionId: string;
  expectedVersion: number;
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
  // Genuinely removes the record's readable content (current AND every
  // prior version's value/valueKind), while preserving the version
  // envelope (id, provenance, timestamps, the "deleted" lifecycle marker
  // itself) for audit purposes. Distinct from appendLifecycleVersion,
  // which never mutates prior rows and is no longer accepted for the
  // "deleted" target lifecycle (see MemoryUseCase.appendLifecycleVersion).
  deleteRecordContent(
    input: DeleteMemoryRecordInput,
  ): Promise<MemoryRecordVersion | null>;
}
