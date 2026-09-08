import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Derivation Trace / Provenance — Increment 1 (Founder Implementation
// Authorization). Structural verification that the new Evaluation /
// Evaluation Standard code introduces none of the explicitly excluded
// concepts (Contract §2/§13; Increment 1 authorization §1/§15). This is
// a structural property of the source text (what the code references),
// not something a live database is required to observe — mirroring the
// existing structural-test convention already used elsewhere in this
// codebase (e.g. personal-intelligence-claim-context.structural.spec.ts).

const SOURCE_FILES = [
  ["src", "persistence", "schema", "personal-intelligence-evaluation.schema.ts"],
  ["src", "core", "personal-intelligence", "personal-intelligence-evaluation.model.ts"],
  ["src", "core", "personal-intelligence", "personal-intelligence-evaluation-standard.model.ts"],
  ["src", "core", "personal-intelligence", "personal-intelligence-evaluation.repository.ts"],
  ["src", "core", "personal-intelligence", "personal-intelligence-evaluation-standard.repository.ts"],
  ["src", "infrastructure", "persistence", "personal-intelligence-evaluation.repository.ts"],
  ["src", "infrastructure", "persistence", "personal-intelligence-evaluation-standard.repository.ts"],
  ["src", "application", "personal-intelligence", "personal-intelligence-evaluation.use-case.ts"],
  ["src", "application", "personal-intelligence", "personal-intelligence-evaluation-standard.use-case.ts"],
] as const;

async function readSource(pathSegments: readonly string[]): Promise<string> {
  return readFile(join(process.cwd(), ...pathSegments), "utf8");
}

// Strips "//" line comments before the exclusion checks below run. The
// source files deliberately carry boundary-documentation comments that
// *name* the excluded concepts (Semantic Conclusion, BSS, Decision 7,
// AIRuntime) precisely so a reader understands what was consciously left
// out (Contract §13; "Preserve Architected Ideas") — mirroring how
// personal-intelligence-relationship.structural.spec.ts's own comments
// name "Decision 7" and "Cross-Claim Matching" without failing its own
// checks, because those checks match code-level identifiers, not prose.
// A raw text search across comments-and-code together would therefore
// always fail on the presence of its own documentation. What must never
// appear is a live code dependency (an import, an identifier, a table or
// column name, a function call) — so these checks run against the code
// with line comments removed.
function stripLineComments(source: string): string {
  return source
    .split("\n")
    .map((line) => {
      const index = line.indexOf("//");
      return index === -1 ? line : line.slice(0, index);
    })
    .join("\n");
}

async function readAllSources(): Promise<string> {
  const contents = await Promise.all(SOURCE_FILES.map(readSource));
  return stripLineComments(contents.join("\n"));
}

test("Increment 1 introduces no Semantic Conclusion persistence/service/table reference", async () => {
  const source = await readAllSources();
  assert.equal(/semantic[_ ]?conclusion/i.test(source), false, "no Semantic Conclusion code reference (import/identifier/table/column) may appear in Increment 1 source");
});

test("Increment 1 introduces no BSS/Bounded Semantic Synthesis persistence or runtime reference", async () => {
  const source = await readAllSources();
  assert.equal(/bounded semantic synthesis|\bBSS\b/i.test(source), false, "no BSS code reference may appear in Increment 1 source");
});

test("Increment 1 introduces no Decision 7 / Cross-Claim / Hypothesis / Relationship-matching reference", async () => {
  const source = await readAllSources();
  assert.equal(/hypothesis|cross-?claim/i.test(source), false, "no Decision 7 code reference may appear in Increment 1 source");
});

test("Increment 1 introduces no AIRuntime execution, model routing, or capability registration reference", async () => {
  const source = await readAllSources();
  assert.equal(/AIRuntime|registerProviderAdapter|ModelRouter|CapabilityRegistry/.test(source), false, "no Gate-7-controlled AI runtime symbol may be referenced by Increment 1 source");
});

test("Increment 1 does not modify Inference's own repository or model files", async () => {
  // Contract §12 of the authorization: default is not to modify
  // Inference. Verified by absence of any edit marker referencing this
  // increment inside the actual Inference source files.
  const inferenceRepositorySource = await readSource([
    "src",
    "infrastructure",
    "persistence",
    "personal-intelligence-inference.repository.ts",
  ]);
  const inferenceModelSource = await readSource([
    "src",
    "core",
    "personal-intelligence",
    "personal-intelligence-inference.model.ts",
  ]);
  assert.equal(
    /Evaluation/.test(inferenceRepositorySource) || /Evaluation/.test(inferenceModelSource),
    false,
    "Inference's own repository/model source must contain no reference to Evaluation — Increment 1 must not modify Inference",
  );
});

test("the new Evaluation repository never references personal_intelligence_relationships (no cross-Claim table access)", async () => {
  const source = await readSource([
    "src",
    "infrastructure",
    "persistence",
    "personal-intelligence-evaluation.repository.ts",
  ]);
  assert.equal(source.includes("personalIntelligenceRelationships"), false);
});

test("the Evaluation schema never declares a generic/polymorphic (type, id) provenance column", async () => {
  const source = await readSource([
    "src",
    "persistence",
    "schema",
    "personal-intelligence-evaluation.schema.ts",
  ]);
  assert.equal(/artifact[_ ]?type|from[_ ]?type|to[_ ]?type/i.test(source), false, "no generic polymorphic type discriminator column may exist (FD-DT-02)");
});
