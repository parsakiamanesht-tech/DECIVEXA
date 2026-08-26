import {
  Gate7InsecureSchemeError,
  Gate7PrivateDestinationError,
  Gate7RequestTooLargeError,
  Gate7ResponseTooLargeError,
  Gate7UntrustedEndpointError,
} from "./gate7-provider-security.errors";

// Gate-7 FD-5 security-control implementations (Founder Implementation
// Authorization: "GATE 7 — DECISION-SCOPED PREREQUISITE IMPLEMENTATION",
// §10). Each function/factory here implements exactly one of the twelve
// FD-5 mandatory controls, narrowly scoped to the Gate-7 controlled-
// execution lineage only. Nothing here modifies
// openai-compatible-provider.adapter.ts — every check below is applied
// either before the adapter is constructed (endpoint checks) or via the
// adapter's own existing, unmodified `fetchImpl` constructor seam
// (request/response size bounding), which was already designed
// specifically to allow exactly this kind of interception without
// touching the adapter itself.

// Structurally identical to the adapter's own private FetchLike type
// (../adapters/openai-compatible-provider.adapter.ts) — not imported
// (that type is not exported, and the adapter file must not be modified
// to export it), but TypeScript's structural typing makes a shared name
// unnecessary: any function matching this signature is assignable to the
// adapter's `fetchImpl` constructor parameter.
export type Gate7FetchLike = (input: string, init: RequestInit) => Promise<Response>;

// --- Control 1: Explicit trusted-endpoint restriction / allow-list ---
//
// Deliberately a real allow-list, distinct from Control 2 (HTTPS-only)
// and Control 3 (private/internal rejection) below — those are necessary
// but not sufficient; this control requires the endpoint to be a member
// of an explicit, separately Founder-configured set
// (AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS), never inferred from
// AI_PROVIDER_ENDPOINT alone. The set is EMPTY by default, so this
// control fails closed for any endpoint until the Founder explicitly
// populates it in a future, separate step — appropriate, since no
// endpoint has been Founder-selected as of this authorization.
export function assertTrustedEndpoint(endpoint: string, trustedEndpoints: ReadonlySet<string>): void {
  if (!trustedEndpoints.has(endpoint)) {
    throw new Gate7UntrustedEndpointError(
      "Gate 7 endpoint is not present in the explicit Founder-configured trusted-endpoint " +
        "allow-list (AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS). No endpoint is trusted by default.",
    );
  }
}

// --- Control 2: HTTPS-only URL scheme validation ---
export function assertHttpsScheme(endpoint: string): void {
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Gate7InsecureSchemeError("Gate 7 endpoint is not a valid absolute URL");
  }
  if (url.protocol !== "https:") {
    throw new Gate7InsecureSchemeError(`Gate 7 endpoint must use the https: scheme, got "${url.protocol}"`);
  }
}

// --- Control 3: Rejection of private/internal destination addresses ---
//
// Deliberately a structural, DNS-free check: it rejects hostnames that
// are themselves literal private/loopback/link-local IP addresses, or
// the literal "localhost". It does NOT perform DNS resolution — doing so
// would require real network activity (forbidden during this
// implementation phase) and would be a materially larger subsystem than
// this narrow control needs ("avoid introducing an unnecessarily broad
// network subsystem" — Founder Implementation Authorization §10, Control
// 3). A hostname that only *resolves* to a private address at request
// time is a known, explicitly out-of-scope limitation of this narrow
// control.
export function assertNotPrivateOrInternalDestination(endpoint: string): void {
  const url = new URL(endpoint);
  const hostname = url.hostname.toLowerCase();

  if (hostname === "localhost") {
    throw new Gate7PrivateDestinationError(`Gate 7 endpoint hostname "${hostname}" is a loopback destination`);
  }
  if (isPrivateOrInternalIpLiteral(hostname)) {
    throw new Gate7PrivateDestinationError(`Gate 7 endpoint hostname "${hostname}" is a private/internal IP literal`);
  }
}

function isPrivateOrInternalIpLiteral(hostname: string): boolean {
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // RFC1918
    if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
    if (a === 192 && b === 168) return true; // RFC1918
    if (a === 169 && b === 254) return true; // link-local
    if (a === 0) return true; // "this network"
    return false;
  }
  const normalized = hostname.replace(/^\[|\]$/g, "");
  if (normalized === "::1") return true; // IPv6 loopback
  if (/^fe[89ab][0-9a-f]:/i.test(normalized)) return true; // fe80::/10 link-local
  if (/^f[cd][0-9a-f]{2}:/i.test(normalized)) return true; // fc00::/7 unique-local
  return false;
}

// --- Controls 4 + 5: Request-size limit / Response-size limit ---
//
// Wraps an existing FetchLike implementation using the adapter's own
// `fetchImpl` constructor seam (openai-compatible-provider.adapter.ts is
// not modified). Request-size is checked against the already-serialized
// `init.body` before the real fetch call. Response-size is checked
// against a declared Content-Length header when present, and — because a
// server is not required to send one — is also enforced by reading the
// response body through a size-capped stream reader BEFORE constructing
// the Response object the adapter goes on to call `.json()` on. This
// achieves genuine pre-parse response-size bounding without any adapter
// modification, using only standard Fetch API primitives.
export interface Gate7TransportSizeLimits {
  readonly maxRequestBytes: number;
  readonly maxResponseBytes: number;
}

export function createBoundedFetch(fetchImpl: Gate7FetchLike, limits: Gate7TransportSizeLimits): Gate7FetchLike {
  return async (input, init) => {
    if (init?.body !== undefined && init.body !== null) {
      const bodyText = typeof init.body === "string" ? init.body : String(init.body);
      const requestBytes = byteLength(bodyText);
      if (requestBytes > limits.maxRequestBytes) {
        throw new Gate7RequestTooLargeError(
          `Gate 7 request body (${requestBytes} bytes) exceeds the configured limit (${limits.maxRequestBytes} bytes)`,
        );
      }
    }

    const response = await fetchImpl(input, init);

    const declaredLength = response.headers.get("content-length");
    if (declaredLength !== null) {
      const declared = Number(declaredLength);
      if (Number.isFinite(declared) && declared > limits.maxResponseBytes) {
        throw new Gate7ResponseTooLargeError(
          `Gate 7 response declared Content-Length (${declared} bytes) exceeds the configured limit (${limits.maxResponseBytes} bytes)`,
        );
      }
    }

    if (!response.body) {
      return response;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > limits.maxResponseBytes) {
          await reader.cancel();
          throw new Gate7ResponseTooLargeError(
            `Gate 7 response body exceeded the configured limit (${limits.maxResponseBytes} bytes) while streaming`,
          );
        }
        chunks.push(value);
      }
    }

    // .buffer is safe to pass as BodyInit here: concatUint8Arrays always
    // allocates a fresh, exactly-sized Uint8Array via `new Uint8Array(total)`
    // (never a view over a larger/shared buffer), so its .buffer is always a
    // genuine ArrayBuffer, never a SharedArrayBuffer — the cast reflects
    // that guarantee, not an unchecked assumption.
    return new Response(concatUint8Arrays(chunks).buffer as ArrayBuffer, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  };
}

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

function concatUint8Arrays(chunks: readonly Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return result;
}
