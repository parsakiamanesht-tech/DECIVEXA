import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Temporal Validity axis
// (docs/gates/PERSONAL-INTELLIGENCE-TEMPORAL-VALIDITY-IMPLEMENTATION-INCREMENT-CONTRACT.md
// §11/§12/§13/§17, Founder-approved Option A - Always Explicit): the
// effectiveFrom/effectiveTo write path must remain fully orthogonal to
// lifecycle, evidence, provenance, confidence, D3 Inference, C3
// confirmation, Memory, and Personal State - no code path introduced by
// this increment may reference any of those mechanisms. This is a
// structural property of the code (what the write path touches), not
// something a live database is required to observe - mirroring the
// existing structural-test convention already used elsewhere in this
// codebase (e.g. personal-intelligence-claim-promotion.structural.spec.ts,
// first-controlled-smoke-test.manual.spec.ts's "does not import or
// reference" tests).

async function readClaimRepositorySource(): Promise<string> {
  return readFile(
    join(
      process.cwd(),
      "src",
      "infrastructure",
      "persistence",
      "personal-intelligence-claim.repository.ts",
    ),
    "utf8",
  );
}

test("the Claim repository's effectiveFrom/effectiveTo write path never references Inference lifecycle-event state (structural: no D3 mutation)", async () => {
  const source = await readClaimRepositorySource();

  assert.equal(
    source.includes("personalIntelligenceInferenceLifecycleEvents"),
    false,
    "the Claim repository must never query or write Inference lifecycle-event history in connection with Temporal Validity",
  );
  assert.equal(source.includes("deriveEffectiveStatus"), false);
});

test("the Claim repository's effectiveFrom/effectiveTo write path never references the C3 confirmation-event table (structural: no confirmation side effect)", async () => {
  const source = await readClaimRepositorySource();

  assert.equal(
    source.includes("personalIntelligenceClaimConfirmationEvents"),
    false,
    "the Claim repository must never write to the Claim confirmation-event table in connection with Temporal Validity",
  );
});

test("the Claim repository does not import Personal State or Memory modules (structural: no cross-module mutation)", async () => {
  const source = await readClaimRepositorySource();

  assert.equal(source.includes("personal-state"), false);
  assert.equal(source.includes("memory.schema"), false);
  assert.equal(source.includes("memory-record"), false);
});

test("effectiveFrom/effectiveTo are never assigned from lifecycle, provenance, or confidence values (structural: axis independence)", async () => {
  const source = await readClaimRepositorySource();

  // Every effectiveFrom/effectiveTo assignment in the file must source
  // its value from input.effectiveFrom/input.effectiveTo (or the
  // equivalent local alias) - never from input.lifecycle,
  // input.provenance, or input.confidence. This greps every line that
  // assigns one of the two temporal columns and asserts none of them
  // reference a different axis's input field.
  const assignmentLines = source
    .split("\n")
    .filter((line) => /effectiveFrom:|effectiveTo:/.test(line));

  assert.ok(assignmentLines.length > 0, "expected to find effectiveFrom/effectiveTo assignments");

  for (const line of assignmentLines) {
    assert.equal(line.includes("input.lifecycle"), false, `unexpected lifecycle reference: ${line}`);
    assert.equal(line.includes("input.provenance"), false, `unexpected provenance reference: ${line}`);
    assert.equal(line.includes("input.confidence"), false, `unexpected confidence reference: ${line}`);
  }
});

test("appendCorrection's effectiveFrom/effectiveTo projection sources only from the correction input, never assigned from the matched prior row's own temporal columns (structural: Option A non-inheritance)", async () => {
  const source = await readClaimRepositorySource();

  // The prior row IS legitimately referenced via
  // personalIntelligenceClaimVersions.effectiveFrom/.effectiveTo
  // elsewhere in this file - in the read-only
  // findActiveClaimVersionsForUser projection, which honestly reports a
  // version's own already-stored values back to the caller. That is not
  // inheritance; it is a plain read, and it must not make this test
  // scoped to the whole file give a false positive. Scope the check
  // specifically to the body of appendCorrection() - the only method
  // where such an assignment would actually constitute inheritance.
  const methodStart = source.indexOf("async appendCorrection(");
  assert.ok(methodStart >= 0, "expected to find appendCorrection() in the repository source");
  const nextMethodStart = source.indexOf("async findVersionsForUser(", methodStart);
  assert.ok(nextMethodStart > methodStart, "expected to find the next method after appendCorrection()");
  const appendCorrectionBody = source.slice(methodStart, nextMethodStart);

  assert.equal(
    appendCorrectionBody.includes("effectiveFrom: personalIntelligenceClaimVersions.effectiveFrom"),
    false,
    "the new version's effectiveFrom must never be assigned directly from the prior row's own effectiveFrom column",
  );
  assert.equal(
    appendCorrectionBody.includes("effectiveTo: personalIntelligenceClaimVersions.effectiveTo"),
    false,
    "the new version's effectiveTo must never be assigned directly from the prior row's own effectiveTo column",
  );
  // Positive check: appendCorrection does source effectiveFrom/effectiveTo
  // from the input, confirming the test is actually exercising the right
  // section of the file rather than trivially passing on empty content.
  assert.equal(appendCorrectionBody.includes("input.effectiveFrom"), true);
  assert.equal(appendCorrectionBody.includes("input.effectiveTo"), true);
});
