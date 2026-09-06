# DECIVEXA Authentication — API Error Serialization & Security Contract V1

**Date:** 2026-09-06  
**Status:** DESIGN / EXECUTION-GATE CONTROLLED  
**Scope:** Founder-approved Option A — Authentication 20-state program  
**Implementation authorization:** Not implied by this document

## 1. Purpose

Define the boundary contract between Authentication application outcomes and the HTTP/API representation consumed by the web client and, later, the runtime evidence harness.

The contract must preserve stable machine-readable semantics, support English/Persian localization without coupling the API to UI copy, and avoid authentication-specific information leakage.

## 2. Existing Architecture Baseline

The application layer already returns `Result<T>`, whose failure branch carries an `Error`. fileciteturn30file0L2-L2

Authentication already lives under `apps/api/src/application/auth`, while its HTTP adapter lives under `apps/api/src/infrastructure/auth`. fileciteturn2file0L2-L2 fileciteturn22file0L2-L2

The shared error layer currently contains `ApplicationError`, `AuthorizationError`, `InfrastructureError`, and `ValidationError`. fileciteturn29file0L2-L2

`ApplicationError` already supports a caller-provided stable `code`. fileciteturn33file0L2-L2

## 3. Critical Current-State Finding

The current HTTP adapter does not preserve the application error taxonomy:

- registration maps **every** failed `Result` to HTTP 409, including validation failures;
- login discards the application error code and always emits HTTP 401 with the literal message `Invalid credentials`.

This behavior is visible in the current `AuthController`. fileciteturn32file0L2-L2

Therefore the existing API boundary is **not yet suitable as the canonical 20-state error contract**.

This is a real implementation finding, not a visual QA finding.

## 4. Canonical Boundary Rules

### 4.1 Application layer

Application use cases return `Result<T>` and may carry typed errors with stable codes.

The application layer must not depend on HTTP status codes, HTTP exception classes, localized strings, or presentation-layer copy.

### 4.2 Infrastructure/HTTP layer

The HTTP adapter owns translation from application error semantics to HTTP representation.

It must:

1. preserve the canonical machine-readable code where the security contract permits exposing it;
2. choose the HTTP status according to the approved mapping;
3. emit a stable response envelope;
4. never expose raw stack traces or infrastructure exception messages;
5. never require the client to parse human-readable text;
6. keep localization out of the API error message contract unless explicitly required by a separate transport decision.

### 4.3 Web client

The web client selects localized user-facing copy from the stable code.

The client must not branch on English message text.

## 5. Proposed Error Response Envelope

For errors that are safe to expose:

```json
{
  "error": {
    "code": "AUTH_INVALID_CREDENTIALS",
    "message": "Invalid credentials",
    "requestId": "..."
  }
}
```

`message` is compatibility/presentation support, not the client branching contract.

For security-sensitive flows, the externally visible code may intentionally be coarser than the internal application code.

No password, raw token, verification secret, reset secret, internal exception, database detail, or account-enumeration signal may appear in the response.

## 6. Canonical Authentication Codes

The following codes are the proposed stable semantic registry for Option A. They are **design identifiers**, not yet production constants.

| Semantic outcome | Proposed code | HTTP target | Security note |
|---|---|---:|---|
| Login invalid credentials | `AUTH_INVALID_CREDENTIALS` | 401 | Same externally for unknown user and wrong password |
| Registration invalid input | `AUTH_INVALID_REGISTRATION_INPUT` | 400 | No sensitive details beyond field-safe validation |
| Registration duplicate | `AUTH_REGISTRATION_CONFLICT` | 409* | Final enumeration posture must be confirmed |
| Verification required | `AUTH_VERIFICATION_REQUIRED` | 403* | Only if this state is intentionally exposed |
| Verification invalid/expired | `AUTH_VERIFICATION_INVALID` | 400* | Do not expose token validity internals |
| Recovery request accepted | `AUTH_RECOVERY_ACCEPTED` | 202/200* | Must not reveal account existence |
| Reset invalid/expired | `AUTH_RESET_INVALID` | 400* | Do not expose reset-token details |
| Session expired/invalid | `AUTH_SESSION_EXPIRED` | 401 | Safe authentication boundary signal |
| Rate limited | `AUTH_RATE_LIMITED` | 429 | Retry metadata only when authoritative |
| Server failure | `AUTH_SERVER_FAILURE` | 5xx | No internal details |
| Network failure | `AUTH_NETWORK_FAILURE` | N/A | Transport/client condition; not an application HTTP error |

`*` = provisional until the dedicated lifecycle/security slice establishes the final contract.

## 7. State/Error Separation

The following are states, not error codes:

- empty;
- focus;
- populated;
- loading;
- success;
- verification waiting;
- recovery confirmation;
- reset entry;
- mobile collapsed.

A state may be caused by an error outcome, but the visual state itself must not be represented as an error code unless its semantics are actually erroneous.

## 8. Security Requirements

### Account enumeration

Recovery and verification flows must use externally safe semantics. The API must not disclose whether a supplied email corresponds to an account unless a separately approved security decision explicitly permits it.

### Credentials and tokens

Never serialize passwords, password hashes, verification secrets, reset secrets, bearer tokens, or equivalent credentials in an error response.

### Infrastructure failures

`InfrastructureError` may carry an internal code, but infrastructure-specific details must not automatically become public API error codes. The HTTP boundary must map internal failures to safe public semantics. The existing infrastructure error abstraction supports a code but does not itself define public exposure policy. fileciteturn31file0L2-L2

### Request correlation

A request identifier may be returned for support/debug correlation, but it must not encode secrets or account information.

## 9. Compatibility Finding

The current implementation creates a mismatch that must be resolved before the canonical registry can be called production-complete:

- `RegisterUserUseCase` distinguishes validation from duplicate-registration failure, but `AuthController` collapses both into HTTP 409. fileciteturn19file0L2-L2 fileciteturn32file0L2-L2
- `AuthenticateUserUseCase` returns an `AuthorizationError`, but `AuthController` replaces its semantics with a new HTTP exception and fixed message. fileciteturn15file0L2-L2 fileciteturn32file0L2-L2

Therefore **Slice A requires an HTTP-boundary mapping correction in addition to stable codes**.

## 10. Implementation Constraints for Slice A

When implementation is authorized:

1. Do not replace `Result<T>`.
2. Do not create a second error framework.
3. Do not move HTTP concerns into application use cases.
4. Do not make the web client parse messages.
5. Do not expose internal infrastructure errors directly.
6. Preserve existing successful login/register response shapes unless a separately approved contract change is required.
7. Preserve current security behavior for invalid credentials while adding machine-readable semantics.
8. Add focused unit/contract tests for application-to-HTTP mappings.
9. Add regression tests proving validation is not incorrectly serialized as conflict.
10. Add regression tests proving invalid credentials have one safe external representation.

## 11. Localization Contract

Localization keys belong to the presentation layer and may be derived from the public error code, for example:

`auth.error.invalidCredentials`

The API must not require Persian or English copy to be embedded in the application error contract.

The same public code must therefore be usable under:

- English / LTR;
- Persian / RTL;
- mixed-direction contexts.

## 12. Runtime Evidence Implications

The runtime evidence harness must assert both:

1. the HTTP response has the expected safe semantic code/status; and
2. the UI renders the corresponding localized semantic state.

A screenshot alone cannot prove API semantics, and an API assertion alone cannot prove visual/accessibility behavior.

## 13. Gate Status

**Result abstraction:** REUSE  
**Error primitives:** REUSE  
**Canonical public-code design:** ESTABLISHED AS PROPOSAL  
**HTTP mapping:** PARTIALLY PROVISIONAL  
**Security review:** REQUIRED BEFORE FINALIZATION  
**Implementation:** NOT EXECUTED  
**Runtime evidence:** BLOCKED  
**Visual Freeze:** NOT REACHED

## 14. Next Controlled Unit

Before implementing the complete lifecycle slices, execute a narrow **Slice A Contract Correction** covering:

- stable public authentication error codes;
- typed application-to-HTTP mapping;
- safe response envelope;
- validation-vs-conflict correction;
- invalid-credential normalization;
- focused regression tests.

Any discovery that requires schema, security-model, authentication-lifecycle, or broader architectural change must stop at the relevant Founder gate rather than being silently expanded into Slice A.
