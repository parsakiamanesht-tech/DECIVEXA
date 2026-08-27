import test from "node:test";
import assert from "node:assert/strict";
import { InMemoryWorkloadRateLimiter, assertWithinRateLimit } from "./workload-rate-limiter.port";
import { RateLimitExceededError } from "../errors/gateway.errors";

// The numeric values below are TEST FIXTURES only — small numbers
// chosen so this suite runs fast. They are not, and must never be
// mistaken for, a Founder-approved production rate-limit threshold
// (Increment 013 Decision 2: numeric value remains deferred).

test("InMemoryWorkloadRateLimiter allows requests within the configured per-workload window", async () => {
  const limiter = new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 3, windowMs: 10_000 });
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
});

test("InMemoryWorkloadRateLimiter rejects once the configured per-workload limit is exceeded (fail-closed)", async () => {
  const limiter = new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 2, windowMs: 10_000 });
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
  assert.equal(await limiter.checkAndConsume("workload-a"), "rejected");
});

test("InMemoryWorkloadRateLimiter tracks each workload identity independently", async () => {
  const limiter = new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 1, windowMs: 10_000 });
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
  assert.equal(await limiter.checkAndConsume("workload-a"), "rejected");
  assert.equal(await limiter.checkAndConsume("workload-b"), "allowed");
});

test("InMemoryWorkloadRateLimiter resets a workload's count once its window elapses", async () => {
  const limiter = new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 1, windowMs: 20 });
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
  assert.equal(await limiter.checkAndConsume("workload-a"), "rejected");
  await new Promise((resolve) => setTimeout(resolve, 30));
  assert.equal(await limiter.checkAndConsume("workload-a"), "allowed");
});

test("assertWithinRateLimit throws RateLimitExceededError (fail-closed) rather than returning a boolean", async () => {
  const limiter = new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 0, windowMs: 10_000 });
  await assert.rejects(() => assertWithinRateLimit(limiter, "workload-a"), RateLimitExceededError);
});

test("no burst allowance or global ceiling is implemented (structural — Increment 013 Decision 2 preserved)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "rate-limit", "workload-rate-limiter.port.ts"), "utf8");
  // Matched as CODE IDENTIFIERS (word-boundary regex against the
  // unmodified source), not prose — the file's own header comment
  // names "burst allowance" and "global ... ceiling" in plain English
  // specifically to disclaim them, which must not itself fail this
  // check; only an actual symbol name (burstSize, tokenBucket,
  // globalCeiling, etc.) would.
  for (const forbidden of [/\bburstSize\b/i, /\btokenBucket\b/i, /\bleakyBucket\b/i, /\brefill\b/i, /\bglobalCeiling\b/i, /\bglobalLimit\b/i]) {
    assert.equal(forbidden.test(source), false, `workload-rate-limiter.port.ts must not implement ${forbidden}`);
  }
});
