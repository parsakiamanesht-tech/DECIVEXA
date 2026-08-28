export type PersonalIntelligenceClaimType =
  | "identity_attribute"
  | "value"
  | "preference"
  | "capability"
  | "constraint"
  | "environment_context"
  | "strength"
  | "weakness"
  | "behavior_pattern";

export type PersonalIntelligenceValueKind = "text" | "boolean" | "enum";

export type PersonalIntelligenceProvenance = "declared" | "observed";

export type PersonalIntelligenceLifecycle =
  | "active"
  | "superseded"
  | "corrected"
  | "revoked"
  | "disputed";

export type PersonalIntelligenceClaim = Readonly<{
  id: string;
  userId: string;
  claimType: PersonalIntelligenceClaimType;
  createdAt: Date;
  updatedAt: Date;
}>;

export type PersonalIntelligenceClaimVersion = Readonly<{
  id: string;
  claimId: string;
  version: number;
  userId: string;
  valueKind: PersonalIntelligenceValueKind;
  valueText: string;
  provenance: PersonalIntelligenceProvenance;
  confidence: number;
  lifecycle: PersonalIntelligenceLifecycle;
  evidenceVersionId: string | null;
  // Additive, D3 (docs/gates/PERSONAL-INTELLIGENCE-D3-IMPLEMENTATION-CONTRACT.md
  // §F/§N): set only by an explicit, separately-scoped promotion write
  // path not yet implemented by this increment - always null until then.
  inferenceId: string | null;
  observedAt: Date;
  acceptedAt: Date;
  createdAt: Date;
}>;
