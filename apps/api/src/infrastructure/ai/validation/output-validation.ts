import type { GenerateResult } from "../provider/ai-provider.types";
import { OutputValidationRejectedError } from "./validation.errors";

// Structural, test-only Output Validation boundary (Founder
// Implementation Authorization: "Output Validation - AUTHORIZED,
// STRUCTURAL-ONLY").
//
// personal-state.interpret's outputSchema is null - no DECIVEXA-specific
// product interpretation contract has been defined for this capability,
// and this increment does not invent one (Founder Implementation
// Authorization §6). This validates only the generic, provider-agnostic
// GenerateResult shape (../provider/ai-provider.types.ts) for structural
// well-formedness - never a product-level "interpretation" semantics,
// and never a claim that this constitutes real AI-output validation.
//
// AIRuntime.execute() remains hard-blocked and never calls this module.
// It is exercised only against synthetic fixtures in tests.
export type OutputValidationResult =
  | Readonly<{ status: "accepted"; result: GenerateResult }>
  | Readonly<{ status: "rejected"; reason: string }>;

export function validateOutput(candidate: GenerateResult): OutputValidationResult {
  if (typeof candidate?.text !== "string" || candidate.text.length === 0) {
    return { status: "rejected", reason: "text must be a non-empty string" };
  }
  if (typeof candidate.finishReason !== "string" || candidate.finishReason.length === 0) {
    return { status: "rejected", reason: "finishReason must be a non-empty string" };
  }
  return { status: "accepted", result: candidate };
}

// Deterministic typed rejection, for a future (separately authorized)
// caller that needs to fail fast on a rejected result rather than
// branch on the discriminated union itself. Not called by any
// production path in this increment - see the module comment above.
export function assertOutputAccepted(result: OutputValidationResult): GenerateResult {
  if (result.status === "rejected") {
    throw new OutputValidationRejectedError(result.reason);
  }
  return result.result;
}
