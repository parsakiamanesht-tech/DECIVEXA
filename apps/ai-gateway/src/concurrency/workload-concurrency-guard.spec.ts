import test from "node:test";
import assert from "node:assert/strict";
import { WorkloadConcurrencyGuard } from "./workload-concurrency-guard";
import { ConcurrencyExhaustedError } from "../errors/gateway.errors";

// maxConcurrentPerWorkload below is a TEST FIXTURE only — Increment 013
// Decision 3 leaves the real numeric ceiling deferred; nothing here
// selects or implies one.

test("WorkloadConcurrencyGuard grants permits up to the configured per-workload ceiling", () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 2 });
  assert.doesNotThrow(() => guard.tryAcquire("workload-a"));
  assert.doesNotThrow(() => guard.tryAcquire("workload-a"));
});

test("WorkloadConcurrencyGuard rejects once the per-workload ceiling is exhausted (REJECT / fail-closed, no queue)", () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  guard.tryAcquire("workload-a");
  assert.throws(() => guard.tryAcquire("workload-a"), ConcurrencyExhaustedError);
});

test("WorkloadConcurrencyGuard tracks each workload identity independently", () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  guard.tryAcquire("workload-a");
  assert.doesNotThrow(() => guard.tryAcquire("workload-b"));
});

test("release() frees a slot so a subsequent acquire for the same workload succeeds", () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  const permit = guard.tryAcquire("workload-a");
  assert.throws(() => guard.tryAcquire("workload-a"), ConcurrencyExhaustedError);
  guard.release(permit);
  assert.doesNotThrow(() => guard.tryAcquire("workload-a"));
});

test("no queueing, retry, or fallback logic is implemented (structural — Increment 013 Decision 3 preserved)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "concurrency", "workload-concurrency-guard.ts"), "utf8");
  // Matched as actual code constructs (identifiers/calls), not prose —
  // this file's own header/method comments explain the "no queue, no
  // retry, no fallback" guarantee in plain English, which must not
  // itself fail this check; only real queueing/retry/timer code would.
  for (const forbidden of [/\bqueue\s*[:=(]/i, /\bretry\s*[:=(]/i, /\bfallback\s*[:=(]/i, /\bsetTimeout\s*\(/i, /\bsetInterval\s*\(/i]) {
    assert.equal(forbidden.test(source), false, `workload-concurrency-guard.ts must not implement ${forbidden}`);
  }
});
