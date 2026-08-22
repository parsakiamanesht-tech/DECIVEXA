import type {
  Evidence,
  EvidenceLifecycle,
  EvidenceProvenance,
  EvidenceVersion,
} from "./evidence.model";

export type CreateEvidenceInput = Readonly<{
  evidenceId: string;
  versionId: string;
  userId: string;
  provenance: EvidenceProvenance;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  now: Date;
}>;

export type AppendLifecycleVersionInput = Readonly<{
  userId: string;
  evidenceId: string;
  versionId: string;
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
  appendLifecycleVersion(
    input: AppendLifecycleVersionInput,
  ): Promise<EvidenceVersion | null>;
}
