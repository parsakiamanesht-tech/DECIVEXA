import type { AICapabilityRegistrationInput } from "./capability.types";

// Gate 7 Controlled Execution capability (Founder Implementation
// Authorization: "GATE 7 — DECISION-SCOPED PREREQUISITE IMPLEMENTATION",
// Founder Decision FD-1(B): create a new, distinct capability rather than
// revise PERSONAL_STATE_INTERPRET_CAPABILITY, which remains historically
// honest as infrastructure-validation-only and is NOT modified by this
// file or this authorization).
//
// Governance boundary: this capability exists solely to carry the Gate-7
// controlled-execution lineage described in
// docs/gates/AI-RUNTIME-GATE-7-FOUNDER-DECISIONS-GOVERNANCE-RECORD.md. It
// is registered, policy-admitted (../policy/policy-authorization.ts), and
// routable to exactly one Gate-7-specific provider/model pair
// (../gate7/gate7-identifiers.ts) — but real execution remains gated
// behind FD-3 (lazy configuration), FD-4 (observability), FD-5 (security
// controls), and FD-6 (a separate, future credential-introduction
// authorization), none of which this registration alone satisfies or
// bypasses. State D remains CLOSED; this file does not open it, and
// registering this capability does not by itself make real execution
// possible — AI_PROVIDER_ENDPOINT remains absent, and no credential is
// introduced by this file.
//
// Execution intent: unlike PERSONAL_STATE_INTERPRET_CAPABILITY, this
// capability's purpose honestly describes a future, tightly controlled,
// single-invocation real execution — not a broad, product-facing,
// autonomous AI capability, and not yet actually executable until every
// FD-1..FD-6 prerequisite is separately satisfied and a further, separate
// Founder authorization permits the smoke test itself.
export const GATE7_CONTROLLED_EXECUTION_CAPABILITY: AICapabilityRegistrationInput = {
  capabilityId: "gate7.controlled-execution",
  version: "1.0",
  purpose:
    "Gate 7 controlled-execution capability: exists to carry the first, " +
    "tightly controlled, single-invocation real AI provider execution " +
    "once separately authorized (real credentials, the execution " +
    "mechanism, and the smoke test itself each require their own future, " +
    "separate Founder authorization). Not a broad product-facing or " +
    "autonomous AI capability; bounded to exactly the Gate-7 " +
    "controlled-execution purpose described in " +
    "docs/gates/AI-RUNTIME-GATE-7-FOUNDER-DECISIONS-GOVERNANCE-RECORD.md.",
  inputSchema: null,
  outputSchema: null,
  // Reuses the existing, unmodified "personal-state" context source
  // (already wired, tested, and whitelisted by AIRuntime.minimizeContext())
  // rather than introducing a new context label — narrower footprint, no
  // new context-resolution wiring required.
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
