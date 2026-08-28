import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// D3 Inference -> Claim Promotion Write Path
// (docs/gates/PERSONAL-INTELLIGENCE-D3-CLAIM-PROMOTION-WRITE-PATH-IMPLEMENTATION-INCREMENT-CONTRACT.md
// §5.F, Founder-approved): promotion/reference of an Inference by a
// ClaimVersion must not be gated by the Inference's lifecycle status, and
// must never itself create a lifecycle-history entry or otherwise touch
// D3's lifecycle mechanism. This is a structural property of the code
// (what tables/functions the write path touches), not something a live
// database is required to observe - mirroring the existing structural-test
// convention already used elsewhere in this codebase (e.g.
// first-controlled-smoke-test.manual.spec.ts's "does not import or
// reference" tests).

test("the Claim repository's Inference-ownership check never references Inference lifecycle-event state (structural: promotion is not lifecycle-gated)", async () => {
  const source = await readFile(
    join(
      process.cwd(),
      "src",
      "infrastructure",
      "persistence",
      "personal-intelligence-claim.repository.ts",
    ),
    "utf8",
  );

  assert.equal(
    source.includes("personalIntelligenceInferenceLifecycleEvents"),
    false,
    "the Claim repository must never query Inference lifecycle-event history - referencing an Inference is not gated by its lifecycle status",
  );
  assert.equal(
    source.includes("deriveEffectiveStatus"),
    false,
    "the Claim repository must never derive or inspect an Inference's effective lifecycle status - promotion is a persistence/reference operation, not a lifecycle transition",
  );

  // Positive check: the ownership verification really does exist, against
  // the Inference identity/ownership columns only.
  assert.equal(source.includes("personalIntelligenceInferences"), true);
  assert.equal(source.includes("personalIntelligenceInferences.userId"), true);
});

test("the Claim repository's Inference-ownership check does not import the Inference lifecycle-event schema table (structural)", async () => {
  const source = await readFile(
    join(
      process.cwd(),
      "src",
      "infrastructure",
      "persistence",
      "personal-intelligence-claim.repository.ts",
    ),
    "utf8",
  );

  const importBlock = source.slice(0, source.indexOf("export class DrizzlePersonalIntelligenceClaimRepository"));

  assert.equal(
    importBlock.includes("personal-intelligence-inference-events") ||
      importBlock.includes("LifecycleEvent"),
    false,
    "no lifecycle-event type or table should be imported by the Claim repository at all",
  );
});
