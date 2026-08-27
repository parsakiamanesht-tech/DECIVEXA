// Zone-3 AI Gateway — request orchestration (Increment 014 §7/§16,
// additional file beyond the literal structure list — justified because
// none of the individual modules alone implements the REQUIRED ordering.
//
// Authoritative order (Founder-authorized corrective pass, resolving the
// pre-commit review's Finding 2 — supersedes this file's original
// authentication -> authorization -> rate-limit -> concurrency order):
//
//   raw bytes -> 16 KiB check -> JSON parse -> shape validation
//     (correlation validation is folded into shape validation — see
//     Finding 3's disposition: functional correctness is sufficient,
//     no separate function was introduced for it)
//   -> authentication -> RATE LIMIT -> AUTHORIZATION -> concurrency
//   -> provider execution (generate() + full response-stream
//      consumption, bounded by ONE combined 30s timeout — corrective
//      pass, Finding 1)
//   -> response validation/normalization -> audit durability
//   -> response release -> concurrency release (always, every outcome)
//
// This file wires the already-independent modules together; it
// introduces no new trust decision of its own. It imports nothing from
// apps/api (Increment 014 §5/§22, non-interference).
import { PROVIDER_TIMEOUT_MS, assertRequestWithinLimit, collectBoundedResponse, withTimeout } from "../provider/transport-limits";
import { parseGatewayRequest } from "../contract/request.types";
import { errorResponse, successResponse, type GatewayResponse } from "../contract/response.types";
import { authorizeGatewayInvocation, type GatewayCapabilityTable, type GatewayWorkloadAllowlist } from "../authorization/gateway-policy";
import type { WorkloadAuthenticator } from "../auth/workload-authentication";
import type { WorkloadRateLimiter } from "../rate-limit/workload-rate-limiter.port";
import { assertWithinRateLimit } from "../rate-limit/workload-rate-limiter.port";
import { WorkloadConcurrencyGuard, type ConcurrencyPermit } from "../concurrency/workload-concurrency-guard";
import type { GatewayProvider } from "../provider/provider-adapter.interface";
import { buildGatewayAuditRecord, type GatewayAuditOutcome, type GatewayAuditSink } from "../audit/gateway-audit-record";
import { errorCodeFor, MalformedProviderResponseError, MalformedRequestError } from "../errors/gateway.errors";

export interface GatewayRequestHandlerDeps {
  readonly authenticator: WorkloadAuthenticator;
  readonly allowlist: GatewayWorkloadAllowlist;
  readonly capabilityTable: GatewayCapabilityTable;
  readonly rateLimiter: WorkloadRateLimiter;
  readonly concurrencyGuard: WorkloadConcurrencyGuard;
  readonly provider: GatewayProvider;
  readonly auditSink: GatewayAuditSink;
  // Optional test-only override. Omitted (the production path, and
  // every other test in this suite) uses exactly the locked
  // PROVIDER_TIMEOUT_MS (30s) — this field changes no production
  // semantics; it exists solely so the regression test for the
  // corrective pass's Finding 1 can prove the ACTUAL orchestration code
  // path (not a standalone copy of the pattern) is bounded, without
  // waiting 30 real seconds. Mirrors the existing precedent of every
  // other dependency here (rateLimiter/concurrencyGuard) being
  // explicitly configured, never silently defaulted for production use.
  readonly providerTimeoutMs?: number;
}

// Best-effort only — used purely so an early-rejected request can still
// echo a correlationId for traceability where one was actually supplied.
// Never treated as validated; parseGatewayRequest() remains the sole
// authority on whether a correlationId is acceptable.
function bestEffortCorrelationId(rawParsed: unknown): string {
  if (typeof rawParsed === "object" && rawParsed !== null && !Array.isArray(rawParsed)) {
    const value = (rawParsed as Record<string, unknown>).correlationId;
    if (typeof value === "string" && value.length > 0) return value;
  }
  return "unknown";
}

export async function handleGatewayRequest(
  rawBody: string,
  workloadCredential: unknown,
  deps: GatewayRequestHandlerDeps,
): Promise<GatewayResponse> {
  // Stage 1: raw-byte size limit — before any parsing, per §7's required
  // ordering. No correlationId is knowable yet.
  try {
    assertRequestWithinLimit(rawBody);
  } catch (error) {
    return errorResponse(errorCodeFor(error), "unknown");
  }

  // Stage 2: JSON parse.
  let rawParsed: unknown;
  try {
    rawParsed = JSON.parse(rawBody);
  } catch {
    return errorResponse(errorCodeFor(new MalformedRequestError("body is not valid JSON")), bestEffortCorrelationId(undefined));
  }

  // Stage 3: shape validation (also the INV-024 structural boundary —
  // see request.types.ts).
  let request: ReturnType<typeof parseGatewayRequest>;
  try {
    request = parseGatewayRequest(rawParsed);
  } catch (error) {
    return errorResponse(errorCodeFor(error), bestEffortCorrelationId(rawParsed));
  }

  // From here on, request.correlationId is validated and used for every
  // response — success or error.
  try {
    // Stage 1 (of the authenticated pipeline): workload authentication
    // (INV-006). Unauthenticated/invalid workload: reject immediately —
    // no rate-limit consumption, no authorization evaluation, no
    // concurrency acquisition, no provider call.
    const workload = await deps.authenticator.authenticate(workloadCredential);

    // Stage 2: rate limiting — corrective pass (Finding 2, Founder
    // decision): rate-limiting now runs BEFORE Gateway authorization,
    // so every authenticated attempt (including one that will go on to
    // fail authorization, e.g. an unknown-capability probe) counts
    // against that workload's budget. Dimension decided, numeric
    // deferred — see rate-limit/workload-rate-limiter.port.ts.
    await assertWithinRateLimit(deps.rateLimiter, workload.workloadId);

    // Stage 3: Gateway authorization (INV-007) — invoker allowlist +
    // capability -> provider/model mapping. apps/api's authorizePolicy()
    // is never re-derived here; this checks only the workload/Gateway
    // boundary. Zone-3 never acquires end-user identity or permissions.
    const route = authorizeGatewayInvocation(workload.workloadId, request.capability, deps.allowlist, deps.capabilityTable);

    // Stage 5 (of the Founder-authorized 11-stage order — "Stage 4,
    // correlation validation" is folded into parseGatewayRequest() at
    // the top of this function; see the file header and Finding 3's
    // disposition): concurrency acquisition, immediately before
    // provider execution. No permit acquired on failure, so nothing to
    // release in that case.
    const permit: ConcurrencyPermit = deps.concurrencyGuard.tryAcquire(workload.workloadId);

    try {
      return await executeProviderAndAudit(request.correlationId, request.capability, request.input, workload.workloadId, route, deps);
    } finally {
      // Structural guarantee (§15): release happens on every exit from
      // this block — success, provider failure, timeout, malformed
      // response, or audit failure — because it is the sole
      // `finally` covering all of them.
      deps.concurrencyGuard.release(permit);
    }
  } catch (error) {
    return errorResponse(errorCodeFor(error), request.correlationId);
  }
}

async function executeProviderAndAudit(
  correlationId: string,
  capability: string,
  input: unknown,
  workloadId: string,
  route: { readonly providerId: string; readonly modelId: string },
  deps: GatewayRequestHandlerDeps,
): Promise<GatewayResponse> {
  const start = Date.now();
  let outcome: GatewayAuditOutcome = "failure";
  let errorCategory: string | undefined;
  let finalResponse: GatewayResponse;

  try {
    // Corrective fix (Founder-authorized corrective pass, Finding 1):
    // the locked 30s timeout must cover the COMPLETE provider round
    // trip — invocation, resolution, AND full consumption of the
    // returned chunk stream — not merely the `generate()` promise. A
    // provider whose `generate()` resolves promptly but whose returned
    // `chunks` iterable never completes must still be bounded by the
    // same timeout. Wrapping generate() and collectBoundedResponse() as
    // one combined async operation, passed to a single withTimeout()
    // call, is what makes that true — wrapping only the first (the
    // prior, defective shape) left stream consumption unbounded.
    const bytes = await withTimeout(
      (async () => {
        const providerResponse = await deps.provider.generate({ providerId: route.providerId, modelId: route.modelId, input });
        return collectBoundedResponse(providerResponse.chunks);
      })(),
      deps.providerTimeoutMs ?? PROVIDER_TIMEOUT_MS,
    );

    let output: unknown;
    try {
      output = bytes.byteLength === 0 ? null : JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      throw new MalformedProviderResponseError("Gateway provider response was not valid JSON");
    }

    outcome = "success";
    finalResponse = successResponse(output, correlationId);
  } catch (error) {
    errorCategory = errorCodeFor(error);
    finalResponse = errorResponse(errorCodeFor(error), correlationId);
  }

  const latencyMs = Date.now() - start;
  const record = buildGatewayAuditRecord({
    correlationId,
    capability,
    workloadId,
    providerId: route.providerId,
    modelId: route.modelId,
    outcome,
    errorCategory,
    latencyMs,
  });

  // Invariant (Increment 011 Decision 3 / Increment 013 §F): the
  // response — success OR provider-side error — is withheld entirely if
  // the audit record cannot be durably recorded. Fail closed.
  try {
    await deps.auditSink.record(record);
  } catch {
    return errorResponse("audit_persistence_failed", correlationId);
  }

  return finalResponse;
}
