import test from "node:test";
import assert from "node:assert/strict";
import { authorizePolicy } from "./policy-authorization";
import type { AICapabilityRegistrationInput } from "../capability/capability.types";
import { createRequestContext } from "../../../context/request-context";

const AUTHENTICATED_CONTEXT = createRequestContext("request-1", "user-1");
const UNAUTHENTICATED_CONTEXT = createRequestContext("request-2");

function authorizedCapability(overrides: Partial<AICapabilityRegistrationInput> = {}): AICapabilityRegistrationInput {
  return {
    capabilityId: "personal-state.interpret",
    version: "1.0",
    purpose: "test fixture",
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
    ...overrides,
  };
}

test("authorizePolicy authorizes the exact authorized capability for an authenticated user", () => {
  const result = authorizePolicy(authorizedCapability(), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "authorized" });
});

test("authorizePolicy denies any capability id other than personal-state.interpret", () => {
  const result = authorizePolicy(authorizedCapability({ capabilityId: "memory.summarize" }), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "unauthorized_capability" });
});

test("authorizePolicy denies when the capability is not eligible", () => {
  const result = authorizePolicy(authorizedCapability({ eligible: false }), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "capability_ineligible" });
});

test("authorizePolicy denies an unauthenticated request", () => {
  const result = authorizePolicy(authorizedCapability(), UNAUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "missing_authenticated_user" });
});

test("authorizePolicy denies any risk classification other than informational-read-only", () => {
  const result = authorizePolicy(authorizedCapability({ riskClassification: "high-risk" }), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "unauthorized_risk_classification" });
});

// Founder Implementation Authorization: "GATE 7 — DECISION-SCOPED
// PREREQUISITE IMPLEMENTATION", §8: proves the allow-list extension
// admits exactly the new Gate-7 capability id, while every other
// previously-established behavior above (personal-state.interpret still
// authorized/denied exactly as before) remains unmodified.

test("authorizePolicy authorizes the new Gate-7 capability id for an authenticated user", () => {
  const result = authorizePolicy(authorizedCapability({ capabilityId: "gate7.controlled-execution" }), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "authorized" });
});

test("authorizePolicy still denies an unrelated capability id after the Gate-7 extension", () => {
  const result = authorizePolicy(authorizedCapability({ capabilityId: "memory.summarize" }), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "unauthorized_capability" });
});

test("authorizePolicy denies an empty/unknown capability id after the Gate-7 extension", () => {
  const result = authorizePolicy(authorizedCapability({ capabilityId: "" }), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "unauthorized_capability" });
});

test("authorizePolicy denies the new Gate-7 capability id when its risk classification is not informational-read-only", () => {
  const result = authorizePolicy(authorizedCapability({ capabilityId: "gate7.controlled-execution", riskClassification: "high-risk" }), AUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "unauthorized_risk_classification" });
});

test("authorizePolicy denies the new Gate-7 capability id for an unauthenticated request", () => {
  const result = authorizePolicy(authorizedCapability({ capabilityId: "gate7.controlled-execution" }), UNAUTHENTICATED_CONTEXT);
  assert.deepEqual(result, { status: "denied", reason: "missing_authenticated_user" });
});

// Structural check, mirroring the existing repository convention: this
// narrow boundary must never reach a provider, a repository, or the
// application layer - it is a pure, local, synchronous decision.
test("policy-authorization.ts never imports a provider adapter, application/, core/, or infrastructure/persistence (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "policy", "policy-authorization.ts"), "utf8");
  const importLines = source.match(/^import .*$/gm) ?? [];
  const forbidden = ["application/", "core/", "infrastructure/persistence", "OpenAiCompatibleProviderAdapter", "ai-provider"];
  for (const line of importLines) {
    for (const symbol of forbidden) {
      assert.equal(line.includes(symbol), false, `policy-authorization.ts must not import ${symbol}: "${line}"`);
    }
  }
});
