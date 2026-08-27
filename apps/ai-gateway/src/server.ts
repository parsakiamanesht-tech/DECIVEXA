// Zone-3 AI Gateway — native node:http entrypoint (Increment 017,
// implementing the Increment 016 Founder-approved runtime architecture
// decision: native node:http, no framework).
//
// This file is the ONLY place in this application that touches raw HTTP.
// Everything downstream of request-boundary translation is delegated to
// the already-implemented, already-tested Gateway orchestration layer
// (../orchestration/gateway-request-handler.ts) — this file introduces
// no new trust decision, no new authorization logic, no new provider
// logic. It imports nothing from apps/api.
import * as http from "node:http";
import { handleGatewayRequest, type GatewayRequestHandlerDeps } from "./orchestration/gateway-request-handler";
import { errorResponse, type GatewayResponse } from "./contract/response.types";
import { MAX_REQUEST_BYTES } from "./provider/transport-limits";
import { RequestTooLargeError, errorCodeFor, type GatewayErrorCode } from "./errors/gateway.errors";

// --- Stage: bounded request-body accumulation ---
//
// Increment 017 §5 (mandatory): the HTTP layer itself must enforce the
// 16 KiB request boundary DURING streaming, before the body is fully
// buffered or handed to JSON.parse — not "read everything, then check
// length." This mirrors transport-limits.ts's collectBoundedResponse()
// discipline (reject and stop reading the instant the cap is crossed),
// applied here to an inbound http.IncomingMessage instead of an
// outbound provider response stream. A malformed Content-Length header
// cannot bypass this — the check is against bytes actually received,
// never against a caller-supplied header value.
export function readBoundedRequestBody(req: http.IncomingMessage, maxBytes: number = MAX_REQUEST_BYTES): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let settled = false;

    const cleanup = () => {
      req.removeListener("data", onData);
      req.removeListener("end", onEnd);
      req.removeListener("error", onError);
      req.removeListener("aborted", onAborted);
    };

    const onData = (chunk: Buffer) => {
      if (settled) return;
      total += chunk.byteLength;
      if (total > maxBytes) {
        settled = true;
        cleanup();
        // Stop consuming immediately — never buffer past the cap, and
        // never process another byte of this body. Deliberately does
        // NOT call req.destroy() here: destroying the request would tear
        // down the underlying socket before the caller can be sent the
        // normalized 413 response, turning a clean rejection into a raw
        // connection reset (a real defect found and fixed during this
        // increment's own test run). Pausing is enough to stop further
        // reads (backpressure applies to whatever the OS/client does
        // with an unconsumed stream) while still allowing handleHttpRequest's
        // catch block to write a proper response on the same connection.
        req.pause();
        reject(new RequestTooLargeError(`Request body exceeded the locked limit (${maxBytes} bytes) while streaming`));
        return;
      }
      chunks.push(chunk);
    };

    const onEnd = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(Buffer.concat(chunks).toString("utf8"));
    };

    const onError = (error: Error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    const onAborted = () => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Request aborted by caller before the body was fully received"));
    };

    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.on("aborted", onAborted);
  });
}

// --- Stage: HTTP status normalization ---
//
// A fixed, total mapping from the existing GatewayErrorCode vocabulary
// (errors/gateway.errors.ts, unchanged) to HTTP status codes. This is a
// standard-HTTP-semantics application, not a new product/API design
// decision — see the Increment 017 final report for the explicit
// rationale distinguishing this from a "FOUNDER DECISION REQUIRED" item.
const STATUS_BY_ERROR_CODE: Readonly<Record<GatewayErrorCode, number>> = {
  malformed_request: 400,
  authentication_failed: 401,
  authorization_denied: 403,
  unauthorized_capability: 403,
  request_too_large: 413,
  rate_limit_exceeded: 429,
  concurrency_exhausted: 429,
  provider_transport_error: 502,
  provider_response_too_large: 502,
  malformed_provider_response: 502,
  provider_timeout: 504,
  audit_persistence_failed: 500,
  unexpected_error: 500,
};

function statusFor(response: GatewayResponse): number {
  if (response.status === "success") return 200;
  return STATUS_BY_ERROR_CODE[response.errorCode] ?? 500;
}

// --- Stage: single-request handling ---
//
// Translates one HTTP request into the existing Gateway request contract
// and back. Never expands the contract, never logs the raw body or
// headers (Increment 017 §5/§8), never touches the workload credential
// beyond passing it through unread to the authentication seam.
async function handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse, deps: GatewayRequestHandlerDeps): Promise<void> {
  // The Google-signed OIDC ID token (INV-006) is presented via the
  // standard `Authorization: Bearer <token>` header — the same
  // convention Google's own Cloud-Run-to-Cloud-Run invoker pattern uses.
  // No alternative/second correlation or credential-transport mechanism
  // is introduced. The raw header value is passed straight into the
  // existing WorkloadAuthenticator seam, unread and unlogged here.
  const authorizationHeader = req.headers["authorization"];
  const workloadCredential =
    typeof authorizationHeader === "string" && authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.slice("Bearer ".length).trim()
      : undefined;

  let gatewayResponse: GatewayResponse;
  try {
    const rawBody = await readBoundedRequestBody(req);
    gatewayResponse = await handleGatewayRequest(rawBody, workloadCredential, deps);
  } catch (error) {
    // Only reachable for RequestTooLargeError (thrown by
    // readBoundedRequestBody itself, before handleGatewayRequest is ever
    // called) or a genuine transport-level failure (client abort/socket
    // error) — handleGatewayRequest() itself never throws; every one of
    // its own failure paths already returns a normalized GatewayResponse.
    gatewayResponse = errorResponse(errorCodeFor(error), "unknown");
  }

  const body = JSON.stringify(gatewayResponse);
  res.writeHead(statusFor(gatewayResponse), {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

// --- Server factory ---
//
// Pure factory over an already-constructed GatewayRequestHandlerDeps —
// exactly the same dependency-injection seam gateway-request-handler.spec.ts
// already exercises with fakes. This function introduces no production
// wiring of its own; see the guarded bootstrap below for why a full
// production dependency set cannot be constructed by this increment.
export function createGatewayServer(deps: GatewayRequestHandlerDeps): http.Server {
  return http.createServer((req, res) => {
    // Only POST is meaningful for this single-endpoint boundary — no
    // routing library, no path matching beyond this one check (Minimum
    // Necessary Architecture: a router is unjustified for one route).
    if (req.method !== "POST") {
      const response = errorResponse("malformed_request", "unknown");
      const body = JSON.stringify(response);
      res.writeHead(405, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(body) });
      res.end(body);
      return;
    }

    handleHttpRequest(req, res, deps).catch(() => {
      // Defensive only — handleHttpRequest() itself already catches
      // every error it can produce and always writes a response. This
      // exists solely so an HTTP-layer bug can never leave a request
      // hanging with no response at all; it never leaks error detail.
      if (!res.headersSent) {
        const response = errorResponse("unexpected_error", "unknown");
        const body = JSON.stringify(response);
        res.writeHead(500, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(body) });
        res.end(body);
      }
    });
  });
}

// --- Graceful shutdown ---
//
// Deliberately introduces NO new numeric configuration value.
// `server.close()` already implements exactly the required semantics —
// stop accepting new connections, let in-flight request/response cycles
// finish naturally, then invoke the callback — without any arbitrary
// force-close grace period. The Gateway's own already-locked 30s
// provider timeout (Increment 013 Decision 1, Increment 014 corrective
// pass) is what bounds the worst-case duration of any single in-flight
// request; introducing a SEPARATE shutdown-grace timeout here would be a
// new architectural number not derivable from any existing decision, so
// none is added (Increment 017 §4: mark rather than invent — there is
// nothing to mark here because none is architecturally required).
// `onShutdownComplete` defaults to the real production side effect
// (`process.exit(0)`) but is overridable — solely so tests can verify
// the "stop accepting new connections, let in-flight work finish" logic
// itself without terminating the test process. This is a testability
// seam, not a behavior change: production callers that omit the
// parameter get exactly the same exit behavior as before.
export function installGracefulShutdown(server: http.Server, onShutdownComplete: () => void = () => process.exit(0)): void {
  let shuttingDown = false;

  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    server.close(() => {
      onShutdownComplete();
    });
  };

  process.on("SIGTERM", shutdown);
}

// --- Guarded production bootstrap ---
//
// NOT a general-purpose entrypoint for this increment's tests — only
// runs when this file is executed directly (`node dist/server.js`).
//
// Deliberately does NOT construct a full production GatewayRequestHandlerDeps.
// Doing so would require a real Google-signed-OIDC WorkloadAuthenticator,
// a real Secret-Manager-backed CredentialSource, and a real HTTP-calling
// GatewayProvider — NONE of which exist anywhere in this repository yet
// (only their interfaces and test-only fakes do), and authoring any of
// them is explicitly out of this increment's scope (Increment 016 §10:
// "DO NOT call Secret Manager"; Increment 017 §9/§10/§24: do not invent
// production identity or values). Fabricating a "production-looking"
// wiring using test fakes would be dishonest; silently omitting the
// gap would violate "not silently invent production defaults."
//
// The correct, evidence-based behavior for THIS increment is therefore
// to fail fast and explicitly at startup, rather than start a server
// that could never correctly serve a real request. This is not a
// missing feature accidentally left out — it is the deliberate, honest
// consequence of Secret Manager / real OIDC verification / a real
// provider adapter being separately, not-yet-authorized work.
if (require.main === module) {
  const port = process.env.PORT;
  if (!port || !/^\d+$/.test(port)) {
    console.error("Gateway startup failed: PORT is required (Cloud Run convention) and was not set.");
    process.exit(1);
  }

  console.error(
    "Gateway startup failed: no production WorkloadAuthenticator, CredentialSource, or GatewayProvider implementation exists yet. " +
      "This entrypoint intentionally fails closed rather than serving traffic it cannot correctly authenticate, authorize, or execute. " +
      "See docs/gates/INCREMENT-016-ZONE-3-GATEWAY-RUNTIME-AND-CREDENTIAL-ARCHITECTURE-GOVERNANCE-RECORD.md and the Increment 017 report.",
  );
  process.exit(1);
}
