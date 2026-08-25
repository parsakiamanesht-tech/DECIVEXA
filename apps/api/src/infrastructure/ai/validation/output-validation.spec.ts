import test from "node:test";
import assert from "node:assert/strict";
import { assertOutputAccepted, validateOutput } from "./output-validation";
import { OutputValidationRejectedError } from "./validation.errors";
import type { GenerateResult } from "../provider/ai-provider.types";

const WELL_FORMED: GenerateResult = { text: "hello", finishReason: "stop" };

test("validateOutput accepts a structurally well-formed synthetic fixture", () => {
  const result = validateOutput(WELL_FORMED);
  assert.deepEqual(result, { status: "accepted", result: WELL_FORMED });
});

test("validateOutput deterministically rejects a malformed synthetic fixture (empty text)", () => {
  const malformed: GenerateResult = { text: "", finishReason: "stop" };
  const result = validateOutput(malformed);
  assert.equal(result.status, "rejected");
});

test("validateOutput deterministically rejects a malformed synthetic fixture (missing finishReason)", () => {
  const malformed = { text: "hello" } as unknown as GenerateResult;
  const result = validateOutput(malformed);
  assert.equal(result.status, "rejected");
});

test("assertOutputAccepted returns the result for an accepted synthetic fixture", () => {
  assert.deepEqual(assertOutputAccepted(validateOutput(WELL_FORMED)), WELL_FORMED);
});

test("assertOutputAccepted throws OutputValidationRejectedError for a rejected synthetic fixture, never a fabricated success", () => {
  const malformed: GenerateResult = { text: "", finishReason: "stop" };
  assert.throws(() => assertOutputAccepted(validateOutput(malformed)), OutputValidationRejectedError);
});

// Structural: this module must never be reachable from an execution
// path, and must never import a provider adapter.
test("output-validation.ts never imports a provider adapter, AIRuntime, or application/core (structural)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "infrastructure", "ai", "validation", "output-validation.ts"), "utf8");
  const importLines = source.match(/^import .*$/gm) ?? [];
  const forbidden = ["OpenAiCompatibleProviderAdapter", "application/", "core/", "infrastructure/persistence", "ai-runtime\""];
  for (const line of importLines) {
    for (const symbol of forbidden) {
      assert.equal(line.includes(symbol), false, `output-validation.ts must not import ${symbol}: "${line}"`);
    }
  }
});
