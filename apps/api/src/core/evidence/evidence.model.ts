export type EvidenceProvenance = "declared" | "observed" | "measured";

export type EvidenceLifecycle =
  | "active"
  | "superseded"
  | "corrected"
  | "revoked"
  | "disputed";

export type Evidence = Readonly<{
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}>;

export type EvidenceVersion = Readonly<{
  id: string;
  evidenceId: string;
  version: number;
  userId: string;
  provenance: EvidenceProvenance;
  lifecycle: EvidenceLifecycle;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  createdAt: Date;
}>;
