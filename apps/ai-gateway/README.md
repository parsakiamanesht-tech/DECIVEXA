# DECIVEXA — Zone-3 AI Gateway (`apps/ai-gateway`)

## Status

**LOCAL SKELETON ONLY — Increment 014, Phases A–D.** Founder-authorized:
"DECIVEXA — FOUNDER IMPLEMENTATION AUTHORIZATION, Increment 014 — Zone-3
AI Gateway, Authorized Scope: Phases A–D Only."

This is a request-contract, authorization-boundary, provider-adapter-
interface, and locally-testable-abstraction implementation only. It is:

- **not deployed** — no HTTP listener is wired up in this phase;
- **not connected to GCP** — no real workload identity, IAM binding, or
  service account exists;
- **not connected to a real AI provider** — every provider used in this
  application's own tests is a fake, in-process implementation
  (`*.testkit.ts` files);
- **not holding a real credential** — `CredentialSource` is an interface
  only; no real secret mechanism is implemented.

State D (real production execution) and Gate 7 (in the separate,
pre-existing `apps/api` AI Runtime lineage) are both unaffected and
remain exactly as they were before this application existed.

## Relationship to `apps/api`

This application is Zone-3. `apps/api`'s existing Gate 1–7 AI Runtime
(`apps/api/src/infrastructure/ai/**`) is Zone-1/Zone-2 and is
**completely untouched** by this application — no file under
`apps/ai-gateway/src` imports anything from `apps/api`, verified by a
structural test in
`src/orchestration/gateway-request-handler.spec.ts`.

The two applications enforce different questions, in series (Increment
010 Option C, dual-layer / defense-in-depth, unchanged):

- `apps/api`'s `authorizePolicy()` decides: *"may this end user use this
  capability?"* — sole authority, never re-derived here.
- This Gateway's `authorizeGatewayInvocation()` decides: *"is this
  authenticated Zone-2 workload allowed to invoke the Gateway, and does
  this capability map to an approved provider/model?"*

## Locked values (Increment 013 Founder Decision 1 — not re-litigated)

| Control | Value |
|---|---|
| Max request body | 16 KiB |
| Max provider response | 64 KiB |
| Provider timeout | 30 seconds |

## Explicitly deferred (not invented in this phase)

- Rate-limit numeric threshold (dimension: per Zone-2 workload identity,
  fail-closed — decided; the number itself is not).
- Concurrency numeric ceiling (dimension: per Zone-2 workload identity,
  REJECT/fail-closed on exhaustion — decided; the number itself is not).
- Real OIDC/workload-identity verification (interface only — see
  `src/auth/workload-authentication.ts`).
- Real credential custody mechanism (interface only — see
  `src/provider/credential-source.port.ts`).
- Production audit persistence (in-memory sink only — see
  `src/audit/gateway-audit-record.ts`).
- HTTP transport/deployment wiring (Phases E–F — a real listener is
  deliberately not part of this phase; every module here is a plain
  TypeScript library, invoked directly by
  `src/orchestration/gateway-request-handler.ts`'s
  `handleGatewayRequest()`, and by this application's own tests).

## Running

```
npm install
npm run typecheck
npm test
```

## What remains unauthorized

Everything in Increment 014's Phases E–J: GCP infrastructure, real
credentials, real endpoints, deployment, `apps/api` integration,
migration, and any Gate-7 retirement decision. Each requires its own
separate, explicit Founder authorization.
