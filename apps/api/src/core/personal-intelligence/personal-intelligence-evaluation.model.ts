// Derivation Trace / Provenance — Increment 1: Evaluation Foundation
// (Founder Implementation Authorization, per
// docs/gates/PERSONAL-INTELLIGENCE-DERIVATION-TRACE-PROVENANCE-ARCHITECTURE-CONTRACT.md
// §7/§8). Single-Claim scope only (FD-DT-03) — an Evaluation is
// associated with exactly one ClaimVersion, never more than one. This
// model does not implement, and must never be conflated with, Semantic
// Conclusion (FD-DT-07) or Bounded Semantic Synthesis — both remain
// entirely out of scope for this increment.

// Evidential Sufficiency result. Kept strictly distinct from Confidence,
// Evidential Weight, and any other score (Contract §9 of the Increment 1
// authorization: "do not collapse... into one generic score").
export type PersonalIntelligenceEvaluationResult = "sufficient" | "insufficient";

// "ai" here records, structurally, that an externally-supplied or
// future AI-derived result is being represented. It never implies that
// this repository invoked AI generation, AIRuntime execution, model
// routing, or capability registration — Gate 7 remains closed and is
// untouched by this model.
export type PersonalIntelligenceEvaluatorType = "human" | "system_deterministic" | "ai";

// Written exactly once, at creation, and never mutated (mirrors the D3
// Inference precedent: "re-evaluation creates a new inference record,
// never a mutation of the original"). Correction/supersession is
// represented by `supersedesEvaluationId` on a brand-new Evaluation row
// — the original row this points to is never updated or deleted.
export type PersonalIntelligenceEvaluation = Readonly<{
  id: string;
  userId: string;
  claimVersionId: string;
  evaluationStandardVersionId: string;
  result: PersonalIntelligenceEvaluationResult;
  evaluatorType: PersonalIntelligenceEvaluatorType;
  producerCapabilityId: string | null;
  producerCapabilityVersion: string | null;
  producerProviderId: string | null;
  producerModelId: string | null;
  modelReportedConfidence: number | null;
  systemAdjustedConfidence: number | null;
  supersedesEvaluationId: string | null;
  evaluatedAt: Date;
  createdAt: Date;
}>;
