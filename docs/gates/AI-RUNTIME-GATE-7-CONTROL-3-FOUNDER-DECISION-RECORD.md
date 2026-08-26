# Governance Record — AIRuntime Gate 7 FD-5 Control 3 Founder Decision

## A. Decision Identity

- **Title:** Governance Record — AIRuntime Gate 7 FD-5 Control 3 Founder Decision
- **Decision ID:** `FD-AI-RUNTIME-GATE-7-CONTROL-3-001`
- **Status:** FOUNDER-APPROVED DECISION RECORD
- **Authority:** Parsa Kiamanesh — Founder & Owner of DECIVEXA
- **Nature:** Records an explicit Founder decision reached after a dedicated read-only Control 3 Founder Decision Audit. This record does not itself authorize any credential, endpoint, provider, or execution activity.

## B. Baseline

`HEAD` = `origin/main` = `1c995cd6ec2888aa4f0edf3a34fdb2e47c6bfecc` at the time of this decision — the commit containing the complete Gate 7 prerequisite implementation and its governance-closure record.

## C. Selected Option

**OPTION A — Keep the current `assertNotPrivateOrInternalDestination` implementation (`gate7-provider-security.ts`) exactly as-is.** No DNS resolution, IP pinning, or outbound proxy/gateway is introduced by this decision, and none is authorized by it.

## D. Current Threat Model

- `AI_PROVIDER_ENDPOINT` and `AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS` are Founder-controlled environment configuration, read only via `resolveOpenAiCompatibleProviderConfig()`/`resolveGate7TrustedEndpoints()`.
- No request-derived, user-derived, tenant-derived, dynamically-discovered, or externally-supplied endpoint input path exists anywhere in this repository.
- No production execution surface exists — `AIRuntime.execute()` remains unreachable from any controller, and the temporary smoke-test harness remains unwired from all production composition.
- Under this narrow model, no attacker-controlled or untrusted-party-controlled input to the endpoint value exists.

## E. Why Option A Is Sufficient for the Current Founder-Only Endpoint Boundary

1. The current implementation correctly rejects literal private/loopback/link-local/internal IP destinations and the literal hostname `"localhost"` before any provider construction or invocation.
2. Because no attacker- or request-controlled input path to the endpoint exists (§D), the DNS-rebinding-style gap described in §F has no attacker capable of exploiting it through this application today.
3. Building DNS resolution/pinning or proxy infrastructure against a threat model that does not currently exist would violate this repository's own Minimum Necessary Architecture / Architecture Before Accumulation principles.

## F. Known DNS-Resolution Limitation (Unchanged, Not Fixed by This Record)

`assertNotPrivateOrInternalDestination` does not perform DNS resolution. A hostname that only *resolves* to a private/internal address at request time is not caught by this control. This limitation remains exactly as previously disclosed in the function's own source comment and in the preceding Control 3 Founder Decision Audit — it is not silently accepted as harmless in general, only as acceptable **for the current, narrow, Founder-only-endpoint threat model** (§D–E).

## G. Why Option B Was Not Selected

DNS resolve-then-check, without genuine connection-time IP pinning, would be insufficient on its own — it narrows but does not close the TOCTOU window a DNS-rebinding attack exploits. Implementing resolution with true pinning would additionally: introduce real outbound DNS network activity at configuration-resolution time; convert `resolveGate7ProviderConfig()` from a synchronous, side-effect-free function into an I/O-performing one; and add new failure modes, error taxonomy, and test infrastructure — a materially larger subsystem than the current, narrowly-scoped threat model justifies.

## H. Why Option C Was Not Selected

An outbound proxy/gateway would introduce a new, standing infrastructure component — with its own deployment, observability, and failure-mode requirements — and a new credential-routing trust boundary (the proxy potentially sitting in the path of the API key), disproportionate to the current one-off, Founder-controlled Gate 7 scope. This would constitute architectural expansion beyond the controlled-execution lineage this gate was scoped to.

## I. Mandatory Future Re-Evaluation Triggers

Control 3 **MUST** be re-evaluated — this decision explicitly does not stand indefinitely — before any implementation or execution proceeds under any future architecture that introduces:

- user-controlled endpoint selection;
- request-derived endpoint selection;
- tenant-controlled endpoint selection;
- dynamic provider discovery;
- arbitrary external URL selection;
- multi-tenant endpoint selection with differing trust boundaries;
- any mechanism allowing an untrusted party to influence the provider endpoint.

**Permanent or repeated execution alone does NOT automatically invalidate this decision**, provided the endpoint remains Founder-controlled, static, explicitly trusted, and outside request/user/tenant influence.

## J. Explicit Non-Authorizations

This record does **not** authorize:

- reading, creating, storing, or configuring any credential;
- configuring `AI_PROVIDER_ENDPOINT` or `AI_PROVIDER_GATE7_TRUSTED_ENDPOINTS`;
- constructing any provider instance with real configuration;
- invoking `runOnce()`, `execute()`, `generate()`, or `healthCheck()`;
- any network or DNS activity;
- opening Gate 7;
- opening State D;
- any modification to `gate7-provider-security.ts`, `gate7-provider-security.spec.ts`, any provider adapter, `ModelRouter`, `ProviderRegistry`, `ModelRegistry`, `AIRuntime`, `app.module.ts`, controller files, capability files, policy files, resolver files, or any other existing governance/ADR document — none were touched in creating this record.

## K. Historical Boundary

This record does not rewrite or reinterpret any prior gate, Founder decision, or governance record in this lineage — including the Control 3 Founder Decision Audit it is based on, or the Gate 7 Prerequisite Completion record it follows.

## L. Final Determination

**CONTROL 3 OPTION A SELECTED — CURRENT IMPLEMENTATION RETAINED UNCHANGED — DECISION SUBJECT TO THE MANDATORY RE-EVALUATION TRIGGERS IN §I — GATE 7 REMAINS CLOSED — STATE D REMAINS CLOSED — NO CREDENTIAL, ENDPOINT, PROVIDER, OR EXECUTION AUTHORIZATION IS GRANTED BY THIS RECORD**
