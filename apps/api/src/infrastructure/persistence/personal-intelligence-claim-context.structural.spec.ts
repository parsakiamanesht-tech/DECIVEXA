import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Claim-Level Context axis
// (docs/gates/PERSONAL-INTELLIGENCE-CONTEXT-IMPLEMENTATION-INCREMENT-CONTRACT.md
// §5/§7/§12/§18/§20, Always Explicit, no new sovereignty field): the
// situationSetting/timeOfDay write path must remain fully orthogonal to
// lifecycle, evidence, provenance, confidence, D3 Inference, C3
// confirmation, Temporal Validity, Memory, and Personal State - no code
// path introduced by this increment may reference any of those
// mechanisms, and no new sovereignty/provenance/lifecycle/confirmation
// column may be introduced for Context. This is a structural property of
// the code (what the write path touches), not something a live database
// is required to observe - mirroring the existing structural-test
// convention already used elsewhere in this codebase (e.g.
// personal-intelligence-claim-temporal-validity.structural.spec.ts,
// personal-intelligence-claim-promotion.structural.spec.ts).

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

test("the Claim repository's situationSetting/timeOfDay write path never references Inference lifecycle-event state (structural: no D3 mutation)", async () => {
  const source = await readClaimRepositorySource();

  assert.equal(
    source.includes("personalIntelligenceInferenceLifecycleEvents"),
    false,
    "the Claim repository must never query or write Inference lifecycle-event history in connection with Context",
  );
  assert.equal(source.includes("deriveEffectiveStatus"), false);
});

test("the Claim repository's situationSetting/timeOfDay write path never references the C3 confirmation-event table (structural: no confirmation side effect)", async () => {
  const source = await readClaimRepositorySource();

  assert.equal(
    source.includes("personalIntelligenceClaimConfirmationEvents"),
    false,
    "the Claim repository must never write to the Claim confirmation-event table in connection with Context",
  );
});

test("the Claim repository does not import Personal State or Memory modules (structural: no cross-module mutation)", async () => {
  const source = await readClaimRepositorySource();

  assert.equal(source.includes("personal-state"), false);
  assert.equal(source.includes("memory.schema"), false);
  assert.equal(source.includes("memory-record"), false);
});

test("no new Context sovereignty/provenance columns are referenced anywhere (structural: Contract §7 - no contextConfidence/contextProvenance/contextLifecycle/contextConfirmation/contextInferenceId)", async () => {
  const source = await readClaimRepositorySource();

  for (const forbidden of [
    "contextConfidence",
    "contextProvenance",
    "contextLifecycle",
    "contextConfirmation",
    "contextInferenceId",
  ]) {
    assert.equal(
      source.includes(forbidden),
      false,
      `unexpected forbidden Context sovereignty field reference: ${forbidden}`,
    );
  }
});

test("situationSetting/timeOfDay are never assigned from lifecycle, provenance, confidence, or Temporal Validity values (structural: axis independence)", async () => {
  const source = await readClaimRepositorySource();

  // Every situationSetting/timeOfDay assignment in the file must source
  // its value from input.situationSetting/input.timeOfDay - never from
  // input.lifecycle, input.provenance, input.confidence,
  // input.effectiveFrom, or input.effectiveTo. This greps every line
  // that assigns one of the two Context columns and asserts none of
  // them reference a different axis's input field.
  const assignmentLines = source
    .split("\n")
    .filter((line) => /situationSetting:|timeOfDay:/.test(line));

  assert.ok(assignmentLines.length > 0, "expected to find situationSetting/timeOfDay assignments");

  for (const line of assignmentLines) {
    assert.equal(line.includes("input.lifecycle"), false, `unexpected lifecycle reference: ${line}`);
    assert.equal(line.includes("input.provenance"), false, `unexpected provenance reference: ${line}`);
    assert.equal(line.includes("input.confidence"), false, `unexpected confidence reference: ${line}`);
    assert.equal(line.includes("input.effectiveFrom"), false, `unexpected Temporal Validity reference: ${line}`);
    assert.equal(line.includes("input.effectiveTo"), false, `unexpected Temporal Validity reference: ${line}`);
  }
});

test("appendCorrection's situationSetting/timeOfDay projection sources only from the correction input, never assigned from the matched prior row's own Context columns (structural: Always Explicit non-inheritance)", async () => {
  const source = await readClaimRepositorySource();

  // The prior row IS legitimately referenced via
  // personalIntelligenceClaimVersions.situationSetting/.timeOfDay
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
    appendCorrectionBody.includes("situationSetting: personalIntelligenceClaimVersions.situationSetting"),
    false,
    "the new version's situationSetting must never be assigned directly from the prior row's own situationSetting column",
  );
  assert.equal(
    appendCorrectionBody.includes("timeOfDay: personalIntelligenceClaimVersions.timeOfDay"),
    false,
    "the new version's timeOfDay must never be assigned directly from the prior row's own timeOfDay column",
  );
  // Positive check: appendCorrection does source situationSetting/timeOfDay
  // from the input, confirming the test is actually exercising the right
  // section of the file rather than trivially passing on empty content.
  assert.equal(appendCorrectionBody.includes("input.situationSetting"), true);
  assert.equal(appendCorrectionBody.includes("input.timeOfDay"), true);
});
