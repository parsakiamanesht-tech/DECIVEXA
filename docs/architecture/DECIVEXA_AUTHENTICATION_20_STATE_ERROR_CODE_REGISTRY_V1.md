# DECIVEXA Authentication 20-State Canonical Error Code Registry V1

Status: DESIGN REGISTRY — NOT IMPLEMENTATION AUTHORIZATION
Scope: Founder-approved Option A — Full 20-State Authentication Matrix

## 1. Purpose

This registry defines stable, machine-readable authentication outcome codes for the full 20-state Authentication QA scope. It is intentionally presentation-neutral: UI copy, language, direction, and visual treatment must not become API contracts.

The existing DECIVEXA `Result<T>` abstraction remains authoritative. Authentication errors must remain compatible with the existing error hierarchy; this registry does not authorize creation of a parallel Result system.

## 2. Governing rules

1. Error codes are stable identifiers, not user-facing messages.
2. English text is never the machine contract.
3. Persian and English localization map from stable codes/keys.
4. RTL/LTR presentation is owned by the presentation layer.
5. A state may have one primary canonical outcome code and additional metadata only where explicitly required.
6. Security-sensitive authentication failures must avoid unnecessary account-existence disclosure.
7. HTTP mapping is an API-boundary concern and must not be inferred by the browser from exception class names.
8. No code in this registry is considered implemented until runtime evidence exists.

## 3. Canonical state registry

| ID | State | Canonical code | Semantic category | Default HTTP mapping | Localization key |
|---|---|---|---|---:|---|
| AUTH-01 | Idle / ready | — | neutral | — | auth.state.idle |
| AUTH-02 | Field validation error | AUTH_INVALID_INPUT | validation | 400 | auth.error.invalidInput |
| AUTH-03 | Invalid credentials | AUTH_INVALID_CREDENTIALS | authentication failure | 401 | auth.error.invalidCredentials |
| AUTH-04 | Authentication loading | — | in-progress | — | auth.state.loading |
| AUTH-05 | Authentication success | — | success | 200 | auth.state.success |
| AUTH-06 | Registration validation error | AUTH_INVALID_INPUT | validation | 400 | auth.error.invalidInput |
| AUTH-07 | Email already registered | AUTH_EMAIL_ALREADY_REGISTERED | registration conflict | 409* | auth.error.emailAlreadyRegistered |
| AUTH-08 | Verification required | AUTH_VERIFICATION_REQUIRED | lifecycle | 403* | auth.error.verificationRequired |
| AUTH-09 | Verification code invalid | AUTH_INVALID_VERIFICATION | verification failure | 400 | auth.error.invalidVerification |
| AUTH-10 | Verification expired | AUTH_VERIFICATION_EXPIRED | verification failure | 400 | auth.error.verificationExpired |
| AUTH-11 | Verification success | — | success | 200 | auth.state.verificationSuccess |
| AUTH-12 | Password recovery requested | — | success / neutral | 202 | auth.state.recoveryRequested |
| AUTH-13 | Password recovery unavailable | AUTH_RECOVERY_UNAVAILABLE | recovery failure | 400 | auth.error.recoveryUnavailable |
| AUTH-14 | Password reset token invalid/expired | AUTH_INVALID_RESET_TOKEN | reset failure | 400 | auth.error.invalidResetToken |
| AUTH-15 | Password reset success | — | success | 200 | auth.state.passwordResetSuccess |
| AUTH-16 | Session expired | AUTH_SESSION_EXPIRED | session lifecycle | 401 | auth.error.sessionExpired |
| AUTH-17 | Rate limited | AUTH_RATE_LIMITED | abuse protection | 429 | auth.error.rateLimited |
| AUTH-18 | Network failure | AUTH_NETWORK_FAILURE | transport failure | — | auth.error.networkFailure |
| AUTH-19 | Server failure | AUTH_SERVER_FAILURE | infrastructure failure | 500 | auth.error.serverFailure |
| AUTH-20 | Recovery / retry state | — | recovery / in-progress | — | auth.state.recovery |

`*` HTTP mappings marked with an asterisk are provisional and require API/security contract review before implementation. They are not implementation decisions.

## 4. Important distinction: state vs error

Not every visual state is an error. Idle, loading, success, recovery and other transition states must not be represented as failures merely to force a uniform API shape.

Conversely, a visual error state must have a deterministic underlying cause whenever the product surface is expected to support runtime evidence.

## 5. Security constraints

The registry does not authorize revealing whether an account exists. Recovery flows should be designed so that externally observable responses do not create an unnecessary account-enumeration oracle. Exact behavior must be resolved in the Authentication security contract before implementation.

## 6. Compatibility with current code

The current Login use case returns an `AuthorizationError` for invalid credentials. The current Registration use case returns `ValidationError` for invalid input and `ApplicationError("EMAIL_ALREADY_REGISTERED", ...)` for duplicate email. These existing behaviors are the starting point for a compatibility migration; no breaking replacement is implied by this document.

## 7. Implementation gate

Before Slice A implementation is authorized, the following must be resolved:

- canonical HTTP mappings for provisional entries;
- API error serialization shape;
- security treatment of recovery and verification responses;
- whether stable codes belong in the shared error abstraction or remain Authentication-owned;
- controller/transport mapping;
- backward-compatibility strategy and tests.

## 8. Freeze rule

This registry is a design artifact. It does not authorize production implementation, schema changes, UI changes, or Visual Freeze.

Founder Visual Freeze remains blocked until the full evidence chain is satisfied.
