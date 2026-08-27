import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_REQUEST_BYTES,
  MAX_RESPONSE_BYTES,
  PROVIDER_TIMEOUT_MS,
  assertRequestWithinLimit,
  collectBoundedResponse,
  withTimeout,
} from "./transport-limits";
import { ProviderResponseTooLargeError, ProviderTimeoutError, RequestTooLargeError } from "../errors/gateway.errors";

test("locked transport values match Increment 013 Founder Decision 1 exactly", () => {
  assert.equal(MAX_REQUEST_BYTES, 16 * 1024);
  assert.equal(MAX_RESPONSE_BYTES, 64 * 1024);
  assert.equal(PROVIDER_TIMEOUT_MS, 30_000);
});

test("assertRequestWithinLimit accepts a body exactly at the 16 KiB boundary", () => {
  const body = "a".repeat(MAX_REQUEST_BYTES);
  assert.doesNotThrow(() => assertRequestWithinLimit(body));
});

test("assertRequestWithinLimit rejects a body one byte over the 16 KiB boundary", () => {
  const body = "a".repeat(MAX_REQUEST_BYTES + 1);
  assert.throws(() => assertRequestWithinLimit(body), RequestTooLargeError);
});

async function* chunksTotaling(totalBytes: number, chunkSize = 4096): AsyncIterable<Uint8Array> {
  let remaining = totalBytes;
  while (remaining > 0) {
    const size = Math.min(chunkSize, remaining);
    yield new Uint8Array(size).fill(1);
    remaining -= size;
  }
}

test("collectBoundedResponse accepts a stream exactly at the 64 KiB boundary", async () => {
  const result = await collectBoundedResponse(chunksTotaling(MAX_RESPONSE_BYTES));
  assert.equal(result.byteLength, MAX_RESPONSE_BYTES);
});

test("collectBoundedResponse rejects a stream exceeding the 64 KiB boundary", async () => {
  await assert.rejects(() => collectBoundedResponse(chunksTotaling(MAX_RESPONSE_BYTES + 1)), ProviderResponseTooLargeError);
});

test("collectBoundedResponse cancels streaming as soon as the cap is crossed, never consuming the entire oversized generator", async () => {
  let yieldedChunks = 0;
  async function* trackedOversizedChunks(): AsyncIterable<Uint8Array> {
    // Yields far more than the cap; if collectBoundedResponse buffered
    // everything before checking size, yieldedChunks would reach the
    // full count below instead of stopping early.
    for (let i = 0; i < 1000; i++) {
      yieldedChunks++;
      yield new Uint8Array(1024).fill(1);
    }
  }

  await assert.rejects(() => collectBoundedResponse(trackedOversizedChunks(), MAX_RESPONSE_BYTES), ProviderResponseTooLargeError);
  assert.ok(yieldedChunks < 1000, "collectBoundedResponse must stop reading before exhausting an oversized generator");
});

test("withTimeout resolves normally for an operation that completes before the deadline", async () => {
  const result = await withTimeout(Promise.resolve("done"), 50);
  assert.equal(result, "done");
});

test("withTimeout rejects with ProviderTimeoutError once the deadline elapses", async () => {
  const neverResolves = new Promise<never>(() => {
    /* deliberately never resolves — this is the provider-timeout scenario */
  });
  await assert.rejects(() => withTimeout(neverResolves, 20), ProviderTimeoutError);
});
