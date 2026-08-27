import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

// Provider-independence guard (Production Eligibility / Development
// Continuity Impact Analysis, docs/DECIVEXA/PRODUCTION_ELIGIBILITY_DEVELOPMENT_IMPACT_ANALYSIS.md
// §20, §26 item 14 "Architecture Guard"). Mirrors the existing
// resource-persistence-boundaries.spec.ts pattern: core/ and application/
// must never import a cloud-vendor SDK directly. Provider-specific code
// belongs exclusively behind an infrastructure/adapter boundary (see
// apps/api/src/infrastructure/ai/adapters/openai-compatible-provider.adapter.ts
// for the existing, approved shape of that boundary) - this test does not
// forbid vendor SDKs anywhere in the repository, only outside that
// boundary, so a future adapter remains free to depend on one.
const roots = [
  join(process.cwd(), "src", "core"),
  join(process.cwd(), "src", "application"),
];

const forbiddenVendorImports = [
  "@google-cloud/",
  "googleapis",
  "aws-sdk",
  "@aws-sdk/",
  "@azure/",
];

async function collectTypeScriptFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTypeScriptFiles(path)));
    } else if (entry.isFile() && entry.name.endsWith(".ts") && !entry.name.endsWith(".spec.ts")) {
      files.push(path);
    }
  }

  return files;
}

test("core and application do not depend directly on a cloud-vendor SDK", async () => {
  for (const root of roots) {
    const files = await collectTypeScriptFiles(root);

    for (const file of files) {
      const source = await readFile(file, "utf8");
      for (const dependency of forbiddenVendorImports) {
        assert.equal(
          source.includes(dependency),
          false,
          `${file} must not depend on ${dependency} - provider-specific code belongs behind an infrastructure/adapter boundary`,
        );
      }
    }
  }
});
