import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const coreRoot = join(process.cwd(), "src", "core");

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

test("core does not depend directly on persistence technologies", async () => {
  const files = await collectTypeScriptFiles(coreRoot);
  const forbidden = [
    "drizzle-orm",
    "drizzle-orm/pg-core",
    "pg",
    "persistence/database",
    "persistence/schema",
  ];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const dependency of forbidden) {
      assert.equal(
        source.includes(dependency),
        false,
        `${file} must not depend on ${dependency}`,
      );
    }
  }
});
