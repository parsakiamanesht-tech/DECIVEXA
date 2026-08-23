export type MemoryProvenance = "declared" | "observed";

export type MemoryLifecycle = "active" | "corrected" | "deleted";

export type MemoryRecord = Readonly<{
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type MemoryRecordVersion = Readonly<{
  id: string;
  recordId: string;
  version: number;
  userId: string;
  provenance: MemoryProvenance;
  lifecycle: MemoryLifecycle;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  createdAt: Date;
}>;
