import type {
  Evidence,
  EvidenceLifecycle,
  EvidenceProvenance,
  EvidenceVersion,
} from "./evidence.model";

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
  evidenceId: string;
  expectedVersion: number;
  lifecycle: EvidenceLifecycle;
  now: Date;
}>;

export interface EvidenceRepository {
  findByIdForUser(userId: string, id: string): Promise<Evidence | null>;
  findVersionForUser(
    userId: string,
    evidenceId: string,
    version: number,
  ): Promise<EvidenceVersion | null>;
  create(input: CreateEvidenceInput): Promise<EvidenceVersion>;
  updateLifecycle(
    input: UpdateEvidenceLifecycleInput,
  ): Promise<EvidenceVersion | null>;
}
