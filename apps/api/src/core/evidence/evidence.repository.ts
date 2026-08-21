import type { Evidence, EvidenceLifecycle, EvidenceProvenance } from "./evidence.model";

export type CreateEvidenceInput = Readonly<{
  id: string;
  userId: string;
  provenance: EvidenceProvenance;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  now: Date;
}>;

export type UpdateEvidenceLifecycleInput = Readonly<{
  userId: string;
  id: string;
  expectedVersion: number;
  lifecycle: EvidenceLifecycle;
  now: Date;
}>;

export interface EvidenceRepository {
  findByIdForUser(userId: string, id: string): Promise<Evidence | null>;
  create(input: CreateEvidenceInput): Promise<Evidence>;
  updateLifecycle(input: UpdateEvidenceLifecycleInput): Promise<Evidence | null>;
}
