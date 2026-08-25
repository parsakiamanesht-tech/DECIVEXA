import type { AICapabilityRegistryEntry } from "../capability/capability.types";

// Minimal, metadata-only Output Policy Validation boundary (Founder
// Implementation Authorization: "First Controlled Execution, Narrow
// Test-Only Scope" §11).
//
// This is NOT a PolicyEngine, NOT content-safety policy, NOT semantic
// correctness policy, NOT a product interpretation schema, NOT
// evidence/provenance validation, NOT quality/confidence scoring. It
// evaluates exactly one already-existing static metadata field -
// capability.humanApprovalRequired (already false for
// personal-state.interpret) - and nothing else. This is the §6 "Policy
// Validation" pipeline stage from DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md,
// distinct from the pre-request Policy Authorization boundary in
// ./policy-authorization.ts, but deliberately as narrow.
export class OutputPolicyValidationDeniedError extends Error {}

export type OutputPolicyValidationDenialReason = "human_approval_required";

export type OutputPolicyValidationResult =
  | Readonly<{ status: "authorized" }>
  | Readonly<{ status: "denied"; reason: OutputPolicyValidationDenialReason }>;

// Pure, deterministic, synchronous decision - no I/O, no provider call,
// no fabricated approval.
export function authorizeOutputPolicy(capability: AICapabilityRegistryEntry): OutputPolicyValidationResult {
  if (capability.humanApprovalRequired) {
    return { status: "denied", reason: "human_approval_required" };
  }
  return { status: "authorized" };
}
