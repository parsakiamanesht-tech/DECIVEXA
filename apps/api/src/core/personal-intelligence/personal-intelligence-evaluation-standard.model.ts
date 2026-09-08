// Derivation Trace / Provenance — Increment 1: Evaluation Standard
// Foundation (Founder Implementation Authorization, per
// docs/gates/PERSONAL-INTELLIGENCE-DERIVATION-TRACE-PROVENANCE-ARCHITECTURE-CONTRACT.md
// §9). Identity/version split, immutable per version, mirroring
// Evidence/Claim exactly. No structured decomposition of material
// criteria is introduced — `criteria` is deliberately a single freeform
// field, per the Contract's own "illustrative-only, not a prescribed
// schema" treatment of purpose/stakes/threshold/relevance.

export type PersonalIntelligenceEvaluationStandard = Readonly<{
  id: string;
  userId: string;
  createdAt: Date;
}>;

// Written exactly once, at creation, and never mutated (Contract §9
// "Historical stability"). A later revision of the same Standard's
// criteria is always a new version row with an incremented `version`,
// never an update to this one.
export type PersonalIntelligenceEvaluationStandardVersion = Readonly<{
  id: string;
  standardId: string;
  userId: string;
  version: number;
  criteria: string;
  createdAt: Date;
}>;
