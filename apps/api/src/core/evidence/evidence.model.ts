export type EvidenceLifecycle =
  | "active"
  | "superseded"
  | "corrected"
  | "revoked"
  | "disputed";

export type EvidenceProvenance = "declared" | "observed" | "measured";

export type Evidence = Readonly<{
  id: string;
  version: number;
  userId: string;
  provenance: EvidenceProvenance;
  lifecycle: EvidenceLifecycle;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
  createdAt: Date;
  updatedAt: Date;
}>;
