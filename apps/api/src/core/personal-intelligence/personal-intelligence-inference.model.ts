import type { PersonalIntelligenceClaimType, PersonalIntelligenceValueKind } from "./personal-intelligence-claim.model";

// D3 Inference Provenance — Option B (Separate Immutable Inference Record)
// plus the §21 Founder Addendum, per
// docs/gates/PERSONAL-INTELLIGENCE-D3-INFERENCE-PROVENANCE-ARCHITECTURE-DECISION-RECORD.md
// and docs/gates/PERSONAL-INTELLIGENCE-D3-IMPLEMENTATION-CONTRACT.md.
export type PersonalIntelligenceInferenceStatus =
  | "proposed"
  | "confirmed"
  | "rejected"
  | "disputed"
  | "stale";

// Every non-initial transition originates from "proposed" and terminates
// there (Contract §F "Permitted transition graph") — nothing broader is
// authorized.
export type PersonalIntelligenceInferenceTerminalStatus = Exclude<
  PersonalIntelligenceInferenceStatus,
  "proposed"
>;

// Written exactly once, at creation, and never mutated or deleted as part
// of ordinary lifecycle handling (Invariant 3/5). No `status`/
// `statusChangedAt` field exists here by design — lifecycle state lives
// exclusively in PersonalIntelligenceInferenceLifecycleEvent below.
export type PersonalIntelligenceInference = Readonly<{
  id: string;
  userId: string;
  claimType: PersonalIntelligenceClaimType;
  valueKind: PersonalIntelligenceValueKind;
  valueText: string;
  generatedAt: Date;
  createdAt: Date;
  producerCapabilityId: string;
  producerCapabilityVersion: string;
  producerProviderId: string;
  producerModelId: string;
  modelReportedConfidence: number | null;
  systemAdjustedConfidence: number | null;
}>;

// One row per lifecycle transition, including the initial `proposed`
// entry (fromStatus: null, sequence: 1). Append-only — never updated,
// never deleted.
export type PersonalIntelligenceInferenceLifecycleEvent = Readonly<{
  id: string;
  inferenceId: string;
  userId: string;
  sequence: number;
  fromStatus: PersonalIntelligenceInferenceStatus | null;
  toStatus: PersonalIntelligenceInferenceStatus;
  transitionedAt: Date;
  createdAt: Date;
}>;

// Pure, deterministic derivation (Contract §F "Effective status
// derivation") — the effective status is never stored as a mutable
// column; it is always computed from the append-only lifecycle history.
// Returns null only when no lifecycle history exists at all, which
// should never occur for a correctly-created inference (creation always
// inserts the initial `proposed` entry atomically) — callers should
// treat a null result as a data-integrity signal, not a valid status.
export function deriveEffectiveStatus(
  events: readonly PersonalIntelligenceInferenceLifecycleEvent[],
): PersonalIntelligenceInferenceStatus | null {
  if (events.length === 0) return null;
  let latest = events[0]!;
  for (const event of events) {
    if (event.sequence > latest.sequence) latest = event;
  }
  return latest.toStatus;
}
