# DECIVEXA Authentication Slice A — Implementation Record V1

Status: IMPLEMENTATION PREPARATION / NO PRODUCTION CODE CHANGE

## Scope

This slice is limited to the Authentication HTTP error-boundary contract established by the preceding audits.

In scope:
- preserve Application-layer `Result<T>` semantics;
- map known Authentication failures at the HTTP boundary;
- expose stable canonical Authentication error codes;
- prevent raw internal error messages from becoming the public contract;
- preserve security-sensitive non-enumeration behavior;
- add regression coverage before behavior is changed.

Out of scope:
- verification lifecycle implementation;
- password recovery/reset implementation;
- session-expiry implementation;
- rate limiting implementation;
- database/schema changes;
- visual/UI changes;
- localization implementation;
- global exception-filter redesign.

## Canonical Boundary

Application: `apps/api/src/application/auth/`

HTTP adapter: `apps/api/src/infrastructure/auth/auth.controller.ts`

Shared primitives: `shared/errors` and `shared/result`

## Required Invariants

1. Successful Login and Registration behavior must remain unchanged.
2. Application use cases remain unaware of HTTP status codes.
3. UI must not parse human-readable error messages.
4. Internal infrastructure details must not be serialized to clients.
5. Authentication responses must not enable account enumeration.
6. Error-code mapping must be deterministic and unit-testable.
7. No new global error abstraction is introduced by this slice.

## Gate

This record does not itself authorize production implementation. The next action is implementation only if the existing controller and test seams can satisfy the invariants without architectural expansion.

If implementation requires schema changes, a new cross-domain error framework, security-model changes, or lifecycle behavior outside this slice, stop and raise a Founder Gate.
