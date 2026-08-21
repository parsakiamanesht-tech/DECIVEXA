import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const applicationFiles = [
  join(__dirname, "application.module.js"),
  join(__dirname, "workspace", "get-workspace-for-owner.use-case.js"),
  join(__dirname, "workspace", "errors", "workspace-not-found.error.js"),
];

const forbiddenImports = [
  "infrastructure/",
  "persistence/",
  "drizzle-orm",
];

test("application layer does not import infrastructure or persistence", () => {
  for (const file of applicationFiles) {
    const source = readFileSync(file, "utf8");
    for (const forbiddenImport of forbiddenImports) {
      assert.equal(
        source.includes(forbiddenImport),
        false,
        `${file} must not depend on ${forbiddenImport}`,
      );
    }
  }
});
