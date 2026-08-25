import type { AICapabilityRegistrationInput } from "./capability.types";

// AI Infrastructure / AIRuntime Production-Wiring Validation
// (Founder Authorization: "AI INFRASTRUCTURE / AIRUNTIME PRODUCTION-WIRING
// VALIDATION - PERSONAL STATE - ROUTE-ONLY").
//
// This capability's sole purpose is to validate that a real,
// Personal-State-context-bearing capability can be registered, context-
// resolved, and routed through real production NestJS wiring. It is
// explicitly NOT a product-facing AI capability: no interpretation is
// implemented, no AI output is generated, and AIRuntime.execute() is
// never invoked for this capability under this increment (see
// ../runtime/ai-runtime.controller.ts).
//
// riskClassification/privacyClassification remain static, unread
// metadata only (capability.types.ts) - no PolicyEngine or RiskEngine
// exists anywhere in this repository to consume them (Founder
// Authorization §8: no such subsystem is authorized by this increment).
export const PERSONAL_STATE_INTERPRET_CAPABILITY: AICapabilityRegistrationInput = {
  capabilityId: "personal-state.interpret",
  version: "1.0",
  purpose:
    "AI infrastructure / AIRuntime production-wiring validation only " +
    "(registration, Personal State context resolution, and routing). " +
    "Not a product-facing AI capability - no interpretation output is " +
    "implemented by this increment.",
  inputSchema: null,
  outputSchema: null,
  requiredContext: ["personal-state"],
  privacyClassification: "standard",
  riskClassification: "informational-read-only",
  minimumQualityThreshold: null,
  latencyTargetMs: null,
  costTarget: null,
  allowedExecutionTiers: [],
  validationRequirements: [],
  humanApprovalRequired: false,
  eligible: true,
};
