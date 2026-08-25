import test from "node:test";
import assert from "node:assert/strict";
import { authorizeOutputPolicy } from "./output-policy-validation";
import type { AICapabilityRegistrationInput } from "../capability/capability.types";

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

test("authorizeOutputPolicy authorizes when humanApprovalRequired is false", () => {
  const result = authorizeOutputPolicy(authorizedCapability());
  assert.deepEqual(result, { status: "authorized" });
});

test("authorizeOutputPolicy denies when humanApprovalRequired is true", () => {
  const result = authorizeOutputPolicy(authorizedCapability({ humanApprovalRequired: true }));
  assert.deepEqual(result, { status: "denied", reason: "human_approval_required" });
});

// Structural: this narrow boundary must never reach a provider, a
// repository, or the application layer, and must never evaluate any
// metadata field beyond humanApprovalRequired (no content-safety,
// semantic-correctness, evidence, provenance, or confidence check).
test("output-policy-validation.ts never imports a provider adapter, application/, core/, or infrastructure/persistence (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "policy", "output-policy-validation.ts"), "utf8");
  const importLines = source.match(/^import .*$/gm) ?? [];
  const forbidden = ["application/", "core/", "infrastructure/persistence", "OpenAiCompatibleProviderAdapter", "ai-provider"];
  for (const line of importLines) {
    for (const symbol of forbidden) {
      assert.equal(line.includes(symbol), false, `output-policy-validation.ts must not import ${symbol}: "${line}"`);
    }
  }
  // Only humanApprovalRequired may be read from the capability metadata.
  const otherMetadataFields = ["privacyClassification", "riskClassification", "minimumQualityThreshold", "allowedExecutionTiers", "validationRequirements"];
  for (const field of otherMetadataFields) {
    assert.equal(source.includes(`capability.${field}`), false, `output-policy-validation.ts must not read capability.${field}`);
  }
});
