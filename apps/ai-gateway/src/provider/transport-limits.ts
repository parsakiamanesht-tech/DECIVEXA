// Zone-3 AI Gateway — locked transport controls (Increment 013 Founder
// Decision 1, Increment 014 §13 / §7).
//
// Values are LOCKED, not re-derived here — mirrored from, but not
// imported from, apps/api's Gate-7 direct-provider defaults
// (gate7-provider-config.ts's DEFAULT_MAX_REQUEST_BYTES /
// DEFAULT_MAX_RESPONSE_BYTES; openai-compatible-provider.config.ts's
// DEFAULT_TIMEOUT_MS), per the non-interference/no-cross-import
// constraint (Increment 014 §11/§22).
import {
  ProviderResponseTooLargeError,
  ProviderTimeoutError,
  RequestTooLargeError,
} from "../errors/gateway.errors";

export const MAX_REQUEST_BYTES = 16 * 1024; // 16 KiB — Increment 013 Decision 1, locked
export const MAX_RESPONSE_BYTES = 64 * 1024; // 64 KiB — Increment 013 Decision 1, locked
export const PROVIDER_TIMEOUT_MS = 30_000; // 30 seconds — Increment 013 Decision 1, locked

export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

// Enforced on the RAW request body, before JSON parsing — Increment 014
// §7's required ordering: an oversized body must never reach the (more
// expensive, attacker-influenceable) parse step.
export function assertRequestWithinLimit(rawBody: string | Uint8Array): void {
  const size = typeof rawBody === "string" ? byteLength(rawBody) : rawBody.byteLength;
  if (size > MAX_REQUEST_BYTES) {
    throw new RequestTooLargeError(`Gateway request body (${size} bytes) exceeds the locked limit (${MAX_REQUEST_BYTES} bytes)`);
  }
}

// Genuinely streaming/bounded, per Increment 014 §13: reads a chunked
// async iterable (a real provider adapter's real HTTP response body, or
// — in tests — a fake provider's own chunk generator) and cancels as
// soon as the cap is crossed, never buffering an unboundedly large
// response and checking its size only afterward.
export async function collectBoundedResponse(chunks: AsyncIterable<Uint8Array>, maxBytes: number = MAX_RESPONSE_BYTES): Promise<Uint8Array> {
  const collected: Uint8Array[] = [];
  let total = 0;

  for await (const chunk of chunks) {
    total += chunk.byteLength;
    if (total > maxBytes) {
      throw new ProviderResponseTooLargeError(`Gateway provider response exceeded the locked limit (${maxBytes} bytes) while streaming`);
    }
    collected.push(chunk);
  }

  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of collected) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}

// Covers the COMPLETE provider round trip — Increment 014 §13 requires
// the timeout to include connection/setup time, not merely the time
// spent reading a response once one starts arriving. Rejects with
// ProviderTimeoutError; the caller (the orchestrator) is responsible for
// never treating a timed-out operation's eventual late resolution as a
// second, retried attempt (no automatic retry is authorized anywhere in
// this Gateway).
export function withTimeout<T>(operation: Promise<T>, timeoutMs: number = PROVIDER_TIMEOUT_MS): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new ProviderTimeoutError(`Gateway provider call exceeded the locked timeout (${timeoutMs} ms)`));
    }, timeoutMs);

    operation.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
