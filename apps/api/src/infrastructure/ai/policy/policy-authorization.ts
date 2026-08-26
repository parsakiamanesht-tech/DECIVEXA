import type { AICapabilityRegistryEntry } from "../capability/capability.types";
import type { RequestContext } from "../../../context/request-context";

// Narrow, deterministic, capability-scoped Policy Authorization boundary
// (Founder Implementation Authorization: "Policy Authorization + Narrow
// Provider Eligibility + Structural Output Validation").
//
// This is NOT a PolicyEngine. It is a single, explicit allow-list check,
// reusing metadata that already exists on AICapabilityRegistrationInput -
// no new taxonomy, no region/compliance/retention/autonomy/tool-permission
// policy, no rule engine, no configuration language, no
// Founder-configurable policy. Any future capability, or any future
// generalization of this boundary, requires its own separate Founder
// authorization - this file must not silently grow to cover either.
//
// Founder Implementation Authorization: "GATE 7 — DECISION-SCOPED
// PREREQUISITE IMPLEMENTATION", §8: extended from a single authorized
// capability id to an explicit two-entry allow-list -
// personal-state.interpret (unchanged behavior) plus
// gate7.controlled-execution (new, FD-1(B)). This remains a narrow,
// explicit allow-list, never a wildcard: any capability id other than
// these two is still denied exactly as before, and the risk-classification
// check below is unchanged - both authorized capabilities must still
// independently declare AUTHORIZED_RISK_CLASSIFICATION.
const AUTHORIZED_CAPABILITY_IDS: ReadonlySet<string> = new Set(["personal-state.interpret", "gate7.controlled-execution"]);
const AUTHORIZED_RISK_CLASSIFICATION = "informational-read-only";

export type PolicyAuthorizationDenialReason =
  | "unauthorized_capability"
  | "capability_ineligible"
  | "missing_authenticated_user"
  | "unauthorized_risk_classification";

export type PolicyAuthorizationResult =
  | Readonly<{ status: "authorized" }>
  | Readonly<{ status: "denied"; reason: PolicyAuthorizationDenialReason }>;

// Pure, deterministic, synchronous decision - no I/O, no provider call,
// no fabricated approval, and no silent pass-through for any unmatched
// case. Every branch is an explicit, typed outcome.
export function authorizePolicy(
  capability: AICapabilityRegistryEntry,
  context: RequestContext,
): PolicyAuthorizationResult {
  if (!AUTHORIZED_CAPABILITY_IDS.has(capability.capabilityId)) {
    return { status: "denied", reason: "unauthorized_capability" };
  }
  if (!capability.eligible) {
    return { status: "denied", reason: "capability_ineligible" };
  }
  if (!context.userId) {
    return { status: "denied", reason: "missing_authenticated_user" };
  }
  if (capability.riskClassification !== AUTHORIZED_RISK_CLASSIFICATION) {
    return { status: "denied", reason: "unauthorized_risk_classification" };
  }
  return { status: "authorized" };
}
