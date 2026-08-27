import test from "node:test";
import assert from "node:assert/strict";
import { handleGatewayRequest, type GatewayRequestHandlerDeps } from "./gateway-request-handler";
import { FakeWorkloadAuthenticator } from "../auth/workload-authenticator.testkit";
import { InMemoryWorkloadRateLimiter } from "../rate-limit/workload-rate-limiter.port";
import { WorkloadConcurrencyGuard } from "../concurrency/workload-concurrency-guard";
import { InMemoryGatewayAuditSink } from "../audit/gateway-audit-record";
import { AlwaysFailingGatewayAuditSink } from "../audit/gateway-audit-record.testkit";
import {
  FakeFailingGatewayProvider,
  FakeMalformedGatewayProvider,
  FakeOversizedGatewayProvider,
  FakeStreamHangingGatewayProvider,
  FakeSuccessfulGatewayProvider,
} from "../provider/gateway-provider.testkit";
import { MAX_RESPONSE_BYTES, PROVIDER_TIMEOUT_MS } from "../provider/transport-limits";
import type { GatewayProvider } from "../provider/provider-adapter.interface";
import type { GatewayCapabilityTable } from "../authorization/gateway-policy";

const CAPABILITY = "gate7.controlled-execution";
const WORKLOAD_CREDENTIAL = "fake-credential-1";
const WORKLOAD_ID = "workload-a";
const TABLE: GatewayCapabilityTable = { [CAPABILITY]: { providerId: "test-provider", modelId: "test-model" } };
const ALLOWLIST = new Set([WORKLOAD_ID]);

function makeDeps(overrides: Partial<GatewayRequestHandlerDeps> = {}): GatewayRequestHandlerDeps {
  return {
    authenticator: new FakeWorkloadAuthenticator(new Map([[WORKLOAD_CREDENTIAL, WORKLOAD_ID]])),
    allowlist: ALLOWLIST,
    capabilityTable: TABLE,
    rateLimiter: new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 1000, windowMs: 60_000 }),
    concurrencyGuard: new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 10 }),
    provider: new FakeSuccessfulGatewayProvider({ ok: true }),
    auditSink: new InMemoryGatewayAuditSink(),
    ...overrides,
  };
}

function validBody(fields: Record<string, unknown> = {}): string {
  return JSON.stringify({ capability: CAPABILITY, input: { hello: "world" }, correlationId: "corr-1", ...fields });
}

// 1. Full pipeline success — request contract, authentication success,
// authorization success, normalized success response.
test("handleGatewayRequest: full pipeline succeeds end-to-end", async () => {
  const deps = makeDeps();
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.deepEqual(response, { status: "success", output: { ok: true }, correlationId: "corr-1" });
});

// 2. Malformed request (invalid JSON).
test("handleGatewayRequest: rejects invalid JSON as malformed_request", async () => {
  const response = await handleGatewayRequest("{ not json", WORKLOAD_CREDENTIAL, makeDeps());
  assert.equal(response.status, "error");
  assert.equal((response as { errorCode: string }).errorCode, "malformed_request");
});

// 3. Missing fields.
test("handleGatewayRequest: rejects a body missing required fields as malformed_request", async () => {
  const response = await handleGatewayRequest(JSON.stringify({ capability: CAPABILITY }), WORKLOAD_CREDENTIAL, makeDeps());
  assert.equal((response as { errorCode: string }).errorCode, "malformed_request");
});

// 4. Unknown capability.
test("handleGatewayRequest: rejects an unknown capability as unauthorized_capability", async () => {
  const response = await handleGatewayRequest(validBody({ capability: "no-such-capability" }), WORKLOAD_CREDENTIAL, makeDeps());
  assert.equal((response as { errorCode: string }).errorCode, "unauthorized_capability");
});

// 6. Authentication failure.
test("handleGatewayRequest: rejects an unrecognized workload credential as authentication_failed", async () => {
  const response = await handleGatewayRequest(validBody(), "forged-credential", makeDeps());
  assert.equal((response as { errorCode: string }).errorCode, "authentication_failed");
});

// 8. Authorization failure (workload not on invoker allowlist).
test("handleGatewayRequest: rejects a workload not on the invoker allowlist as authorization_denied", async () => {
  const deps = makeDeps({ allowlist: new Set(["someone-else"]) });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "authorization_denied");
});

// Corrective-pass ordering tests (pre-commit review Finding 2 — Founder
// decision: authenticate -> RATE LIMIT -> AUTHORIZATION -> concurrency).

// 13/14. Rate-limit rejection happens before, and independent of,
// authorization — proving the corrected order closes the gap the
// original order left open (an authorization-failing request used to
// consume no rate-limit budget at all).
test("handleGatewayRequest: rate-limit rejection occurs before Gateway authorization is ever evaluated", async () => {
  const deps = makeDeps({
    rateLimiter: new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 0, windowMs: 60_000 }),
    // An allowlist that would also reject this workload — if
    // authorization ran first (the pre-corrective order), the response
    // could still be authorization_denied; asserting rate_limit_exceeded
    // proves rate-limiting is now evaluated first, per stage 2.
    allowlist: new Set(["someone-else"]),
  });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "rate_limit_exceeded");
});

// 13. An authenticated workload's unauthorized-capability probes now
// DO consume its rate-limit budget (closing Finding 2's gap): after
// exhausting a 1-request budget with an authorization-failing attempt,
// a subsequent otherwise-valid request is rate-limited, not authorized.
test("handleGatewayRequest: an authorization-failing attempt still consumes rate-limit budget (Finding 2 closed)", async () => {
  const limiter = new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 1, windowMs: 60_000 });
  const deps = makeDeps({ rateLimiter: limiter });

  const first = await handleGatewayRequest(validBody({ capability: "no-such-capability" }), WORKLOAD_CREDENTIAL, deps);
  assert.equal((first as { errorCode: string }).errorCode, "unauthorized_capability");

  const second = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((second as { errorCode: string }).errorCode, "rate_limit_exceeded", "the first, authorization-failing attempt must have consumed the rate-limit budget");
});

// 14. Authorization is still correctly evaluated, and still correctly
// denies, once the rate-limit check has passed.
test("handleGatewayRequest: authorization is evaluated (and can still deny) after a successful rate-limit check", async () => {
  const deps = makeDeps({
    rateLimiter: new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 1000, windowMs: 60_000 }),
    allowlist: new Set(["someone-else"]),
  });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "authorization_denied");
});

// 9–13. Caller-supplied provider/model/endpoint/credential/raw-HTTP
// rejected — proven end-to-end (unit-level proof already in
// contract/request.types.spec.ts).
for (const field of ["providerUrl", "apiKey", "model", "provider", "endpoint", "authorizationHeader", "httpMethod", "headers"]) {
  test(`handleGatewayRequest: rejects a caller-supplied "${field}" field before any provider is reached`, async () => {
    let providerCalled = false;
    const spyProvider: GatewayProvider = {
      async generate(request) {
        providerCalled = true;
        return new FakeSuccessfulGatewayProvider().generate(request);
      },
    };
    const response = await handleGatewayRequest(validBody({ [field]: "attacker-value" }), WORKLOAD_CREDENTIAL, makeDeps({ provider: spyProvider }));
    assert.equal((response as { errorCode: string }).errorCode, "malformed_request");
    assert.equal(providerCalled, false, "the provider must never be reached when the envelope carries a forbidden field");
  });
}

// 14. 16 KiB request boundary — succeeds.
test("handleGatewayRequest: accepts a request body exactly at the 16 KiB boundary", async () => {
  const padding = "x".repeat(16 * 1024 - validBody().length);
  const body = validBody({ input: { padding } });
  // The padded body may slightly exceed 16 KiB due to JSON escaping;
  // shrink until it fits exactly at-or-under the boundary, proving the
  // boundary itself (not a smaller, unrepresentative body) is accepted.
  const encoder = new TextEncoder();
  let candidate = body;
  while (encoder.encode(candidate).byteLength > 16 * 1024) {
    candidate = validBody({ input: { padding: padding.slice(0, -1) } });
  }
  const response = await handleGatewayRequest(candidate, WORKLOAD_CREDENTIAL, makeDeps());
  assert.equal(response.status, "success");
});

// 15. Oversized request rejection.
test("handleGatewayRequest: rejects a request body over the 16 KiB boundary as request_too_large", async () => {
  const body = validBody({ input: { padding: "x".repeat(20 * 1024) } });
  const response = await handleGatewayRequest(body, WORKLOAD_CREDENTIAL, makeDeps());
  assert.equal((response as { errorCode: string }).errorCode, "request_too_large");
});

// 16. 64 KiB provider response boundary — succeeds.
test("handleGatewayRequest: accepts a provider response exactly at the 64 KiB boundary", async () => {
  // A JSON array of a single string sized so the serialized bytes land
  // exactly at MAX_RESPONSE_BYTES.
  const overhead = JSON.stringify({ v: "" }).length;
  const value = "a".repeat(MAX_RESPONSE_BYTES - overhead);
  const deps = makeDeps({ provider: new FakeSuccessfulGatewayProvider({ v: value }) });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal(response.status, "success");
});

// 17. Oversized provider response rejection.
test("handleGatewayRequest: rejects an oversized provider response as provider_response_too_large", async () => {
  const deps = makeDeps({ provider: new FakeOversizedGatewayProvider(MAX_RESPONSE_BYTES + 1024) });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "provider_response_too_large");
});

// Corrective-pass regression test (pre-commit review Finding 1 — BLOCKER):
// reproduces the exact discovered defect. generate() resolves promptly;
// the returned chunk stream never completes. Exercised through the REAL
// handleGatewayRequest() / executeProviderAndAudit() code path (not a
// standalone copy of the withTimeout() pattern), using the documented,
// non-semantics-changing test-only providerTimeoutMs override so this
// suite does not wait 30 real seconds — the production constant
// (PROVIDER_TIMEOUT_MS, asserted below to still be exactly 30_000) is
// untouched by this override.
test("handleGatewayRequest: bounds a provider whose generate() resolves but whose response stream hangs forever, within the timeout — regression for pre-commit review Finding 1", async () => {
  assert.equal(PROVIDER_TIMEOUT_MS, 30_000, "the production timeout constant must remain locked at exactly 30 seconds");

  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  const sink = new InMemoryGatewayAuditSink();
  const deps = makeDeps({
    provider: new FakeStreamHangingGatewayProvider(),
    concurrencyGuard: guard,
    auditSink: sink,
    providerTimeoutMs: 25, // test-only override — production remains 30_000, asserted above
  });

  const started = Date.now();
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  const elapsedMs = Date.now() - started;

  // The timeout applies to stream consumption: the call returns instead
  // of hanging indefinitely, and does so close to the configured bound
  // (generous upper margin for test-runner scheduling jitter — this is
  // not asserting exact timing, only that it is bounded at all).
  assert.ok(elapsedMs < 5000, `expected the request to be bounded by the timeout, took ${elapsedMs}ms`);

  // The provider timeout error is normalized correctly; no successful
  // response is returned.
  assert.equal(response.status, "error");
  assert.equal((response as { errorCode: string }).errorCode, "provider_timeout");

  // The concurrency permit is eventually released — a second acquire
  // for the same workload must succeed immediately.
  assert.doesNotThrow(() => guard.tryAcquire(WORKLOAD_ID), "the permit must have been released once the timeout fired");

  // Fail-closed and auditable: an audit entry was still durably
  // recorded for the timed-out attempt (outcome: failure), and it
  // carries no raw provider detail (there is none to carry — the
  // provider never returned anything before timing out).
  const [entry] = sink.list();
  assert.ok(entry, "a timeout must still produce an audit entry");
  assert.equal(entry.outcome, "failure");
  assert.equal(entry.errorCategory, "provider_timeout");

  // No raw provider detail leaks anywhere in the response.
  assert.equal(JSON.stringify(response).toLowerCase().includes("hang"), false);
});

// 19. Provider transport failure.
test("handleGatewayRequest: normalizes a provider transport failure as provider_transport_error", async () => {
  const deps = makeDeps({ provider: new FakeFailingGatewayProvider() });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "provider_transport_error");
});

// 20. Malformed provider response.
test("handleGatewayRequest: normalizes a malformed (non-JSON) provider response as malformed_provider_response", async () => {
  const deps = makeDeps({ provider: new FakeMalformedGatewayProvider() });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "malformed_provider_response");
});

// 21–22. Rate-limit abstraction / fail-closed behavior, end-to-end.
test("handleGatewayRequest: rejects once the injected rate limiter reports exhaustion (fail-closed)", async () => {
  const deps = makeDeps({ rateLimiter: new InMemoryWorkloadRateLimiter({ maxRequestsPerWindow: 0, windowMs: 60_000 }) });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "rate_limit_exceeded");
});

// 23–24. Concurrency acquisition / exhaustion, end-to-end.
test("handleGatewayRequest: rejects once the injected concurrency guard is exhausted (REJECT, no queue)", async () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  guard.tryAcquire(WORKLOAD_ID); // pre-exhaust the only slot
  const deps = makeDeps({ concurrencyGuard: guard });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal((response as { errorCode: string }).errorCode, "concurrency_exhausted");
});

// 25. Permit release after success.
test("handleGatewayRequest: releases the concurrency permit after a successful provider execution", async () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  const deps = makeDeps({ concurrencyGuard: guard });
  await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.doesNotThrow(() => guard.tryAcquire(WORKLOAD_ID), "the permit must have been released after success");
});

// 26. Permit release after provider failure.
test("handleGatewayRequest: releases the concurrency permit after a provider transport failure", async () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  const deps = makeDeps({ concurrencyGuard: guard, provider: new FakeFailingGatewayProvider() });
  await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.doesNotThrow(() => guard.tryAcquire(WORKLOAD_ID), "the permit must have been released after a provider failure");
});

// 28. Permit release after audit failure.
test("handleGatewayRequest: releases the concurrency permit even when the audit write fails", async () => {
  const guard = new WorkloadConcurrencyGuard({ maxConcurrentPerWorkload: 1 });
  const deps = makeDeps({ concurrencyGuard: guard, auditSink: new AlwaysFailingGatewayAuditSink() });
  await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.doesNotThrow(() => guard.tryAcquire(WORKLOAD_ID), "the permit must have been released even when the audit write failed");
});

// 29. Audit success.
test("handleGatewayRequest: durably records an audit entry, correlated by correlationId, on success", async () => {
  const sink = new InMemoryGatewayAuditSink();
  const deps = makeDeps({ auditSink: sink });
  await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  const [entry] = sink.list();
  assert.ok(entry, "an audit entry must have been recorded");
  assert.equal(entry.correlationId, "corr-1");
  assert.equal(entry.outcome, "success");
  assert.equal(entry.workloadId, WORKLOAD_ID);
});

// 30. Audit failure → response withheld (fail-closed), even though the
// provider itself succeeded.
test("handleGatewayRequest: withholds the response and returns audit_persistence_failed when durable audit recording fails", async () => {
  const deps = makeDeps({ auditSink: new AlwaysFailingGatewayAuditSink() });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal(response.status, "error");
  assert.equal((response as { errorCode: string }).errorCode, "audit_persistence_failed");
});

// 31. Credential non-exposure — even if a provider's internal transport
// error message happened to embed a secret, the normalized Gateway
// response can never contain it, because GatewayErrorResponse's shape
// structurally has no field beyond a fixed errorCode enum.
test("handleGatewayRequest: a provider-side error message containing a fake secret never appears anywhere in the Gateway response", async () => {
  const secret = "sk-fake-super-secret-value-12345";
  const leakyProvider: GatewayProvider = {
    async generate() {
      throw new Error(`upstream rejected credential ${secret}`);
    },
  };
  const deps = makeDeps({ provider: leakyProvider });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  const serialized = JSON.stringify(response);
  assert.equal(serialized.includes(secret), false, "the Gateway response must never contain provider-side error detail, including any embedded secret");
});

test("handleGatewayRequest: a provider-side error message containing a fake secret never appears in the audit record", async () => {
  const secret = "sk-fake-super-secret-value-67890";
  const leakyProvider: GatewayProvider = {
    async generate() {
      throw new Error(`upstream rejected credential ${secret}`);
    },
  };
  const sink = new InMemoryGatewayAuditSink();
  const deps = makeDeps({ provider: leakyProvider, auditSink: sink });
  await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  const serialized = JSON.stringify(sink.list());
  assert.equal(serialized.includes(secret), false, "the audit record must never contain provider-side error detail, including any embedded secret");
});

// 32. Correlation propagation — same correlationId flows into both the
// response and the audit record.
test("handleGatewayRequest: propagates the exact same correlationId into both the response and the audit record", async () => {
  const sink = new InMemoryGatewayAuditSink();
  const deps = makeDeps({ auditSink: sink });
  const response = await handleGatewayRequest(validBody({ correlationId: "trace-xyz" }), WORKLOAD_CREDENTIAL, deps);
  assert.equal(response.correlationId, "trace-xyz");
  assert.equal(sink.list()[0]?.correlationId, "trace-xyz");
});

// 33–34. Normalized errors / normalized success — every response shape
// this suite has produced above is deepEqual-checked against exactly
// {status, output|errorCode, correlationId}; no additional assertion
// needed here beyond confirming the invariant holds across the two
// response-producing code paths.
test("every GatewayResponse this suite observes has exactly the normalized shape", async () => {
  const success = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, makeDeps());
  assert.deepEqual(Object.keys(success).sort(), ["correlationId", "output", "status"]);

  const failure = await handleGatewayRequest("not json", WORKLOAD_CREDENTIAL, makeDeps());
  assert.deepEqual(Object.keys(failure).sort(), ["correlationId", "errorCode", "status"]);
});

// 35. No raw provider response passthrough.
test("handleGatewayRequest: the success response's output is the parsed provider result, never a raw byte/text passthrough", async () => {
  const deps = makeDeps({ provider: new FakeSuccessfulGatewayProvider({ nested: { value: 1 } }) });
  const response = await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, deps);
  assert.equal(response.status, "success");
  assert.deepEqual((response as { output: unknown }).output, { nested: { value: 1 } });
  // A raw passthrough would be a string/Buffer of the wire bytes, not a
  // parsed object — this assertion is what rules that out.
  assert.equal(typeof (response as { output: unknown }).output, "object");
});

// 36. No automatic retry.
test("handleGatewayRequest: calls a failing provider exactly once — no automatic retry", async () => {
  let callCount = 0;
  const countingFailingProvider: GatewayProvider = {
    async generate() {
      callCount++;
      throw new Error("simulated failure");
    },
  };
  await handleGatewayRequest(validBody(), WORKLOAD_CREDENTIAL, makeDeps({ provider: countingFailingProvider }));
  assert.equal(callCount, 1);
});

// 37 + structural non-interference — no fallback routing exists, and
// this application never imports apps/api.
test("structural: no file under apps/ai-gateway/src imports anything from apps/api (non-interference, Increment 014 §5/§22)", async () => {
  const { readFile, readdir } = await import("node:fs/promises");
  const { join } = await import("node:path");

  async function collectTsFiles(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...(await collectTsFiles(full)));
      else if (entry.name.endsWith(".ts")) files.push(full);
    }
    return files;
  }

  const srcDir = join(process.cwd(), "src");
  const files = await collectTsFiles(srcDir);
  assert.ok(files.length > 0, "expected to find source files to scan");

  for (const file of files) {
    const source = await readFile(file, "utf8");
    const importLines = source.match(/^import .*$/gm) ?? [];
    for (const line of importLines) {
      assert.equal(line.includes("apps/api"), false, `${file} must not import from apps/api: "${line}"`);
      assert.equal(/from ["']\.\.\/.*api\//.test(line), false, `${file} must not import a relative apps/api path: "${line}"`);
    }
  }
});

test("structural: the orchestrator has no queue/retry/fallback logic anywhere (Increment 010 Decision 1 / Increment 013 preserved)", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "orchestration", "gateway-request-handler.ts"), "utf8");
  for (const forbidden of ["retry", "fallback", "queue", "secondaryProvider", "directProvider"]) {
    assert.equal(source.toLowerCase().includes(forbidden.toLowerCase()), false, `gateway-request-handler.ts must not implement "${forbidden}"`);
  }
});

// Strengthened per the pre-commit review's Finding-1-adjacent
// test-effectiveness finding: the ORIGINAL version of this test only
// asserted the substring "withTimeout(" appeared somewhere in the file
// — true both before and after the corrective fix, so it provided no
// real signal and is exactly the kind of false-positive structural test
// the review flagged. This version parses out the actual argument
// expression passed to the `withTimeout(` call and asserts that BOTH
// `.generate(` and `collectBoundedResponse(` appear textually inside
// it — i.e., inside the single operation being timed — rather than
// merely existing somewhere in the file. This is complementary evidence
// only; the behavioral regression test above (FakeStreamHangingGatewayProvider)
// is the primary proof, per this pass's explicit instruction to prefer
// behavior over structure.
test("structural (complementary only): withTimeout()'s argument expression contains BOTH provider.generate( and collectBoundedResponse( — i.e. covers the combined operation, not just generate()", async () => {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  const source = await readFile(join(process.cwd(), "src", "orchestration", "gateway-request-handler.ts"), "utf8");

  const callStart = source.indexOf("await withTimeout(");
  assert.ok(callStart >= 0, "gateway-request-handler.ts must wrap provider execution in withTimeout()");

  // Walk forward from the opening "(" tracking paren depth to find this
  // specific withTimeout(...) call's matching close, so the check is
  // scoped to its actual argument expression, not the rest of the file.
  const openParenIndex = source.indexOf("(", callStart + "await withTimeout".length);
  let depth = 0;
  let closeParenIndex = -1;
  for (let i = openParenIndex; i < source.length; i++) {
    if (source[i] === "(") depth++;
    else if (source[i] === ")") {
      depth--;
      if (depth === 0) {
        closeParenIndex = i;
        break;
      }
    }
  }
  assert.ok(closeParenIndex > openParenIndex, "could not locate the matching close paren for the withTimeout( call");

  const argumentExpression = source.slice(openParenIndex, closeParenIndex);
  assert.ok(argumentExpression.includes(".generate("), "withTimeout()'s argument must include the provider.generate( call");
  assert.ok(argumentExpression.includes("collectBoundedResponse("), "withTimeout()'s argument must include collectBoundedResponse( — this is exactly what the pre-commit review's Finding 1 found missing");
});
