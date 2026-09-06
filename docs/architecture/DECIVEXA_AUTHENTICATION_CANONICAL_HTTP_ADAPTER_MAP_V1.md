# DECIVEXA Authentication Canonical HTTP Adapter Map V1

**Status:** AUDIT COMPLETE — IMPLEMENTATION NOT EXECUTED
**Branch:** main
**Scope:** Option A / Full 20-State Authentication

## 1. Canonical runtime composition

The current API bootstraps `AppModule` from `main.ts`. `AppModule` imports the infrastructure `AuthModule`. `AuthModule` owns the HTTP controller and wires it to the application authentication use cases and infrastructure services.

Canonical chain:

`main.ts` → `AppModule` → `infrastructure/auth/AuthModule` → `AuthController` → `application/auth/*UseCase` → infrastructure auth services/repository

## 2. Verified source locations

- `apps/api/src/main.ts` — Nest bootstrap.
- `apps/api/src/app.module.ts` — application composition; imports `AuthModule`.
- `apps/api/src/infrastructure/auth/auth.module.ts` — Auth HTTP module; registers `AuthController`, use cases, guard, token/password services and credentials repository.
- `apps/api/src/infrastructure/auth/auth.controller.ts` — canonical HTTP adapter for `/auth/register`, `/auth/login`, `/auth/me`.
- `apps/api/src/application/auth/authenticate-user.use-case.ts` — Login application behavior.
- `apps/api/src/application/auth/register-user.use-case.ts` — Registration application behavior.

## 3. Current HTTP behavior audit

### POST /auth/register

- Returns `201 Created` on success.
- Delegates to `RegisterUserUseCase`.
- Current adapter converts **every application failure** to `409 Conflict` and exposes `result.error.message`.
- This loses the distinction between validation failure and duplicate registration.

### POST /auth/login

- Returns `200 OK` on success.
- Delegates to `AuthenticateUserUseCase`.
- Current adapter converts any application failure to `401 Unauthorized` with the hard-coded message `Invalid credentials`.
- This discards the stable application error semantics needed by the 20-state contract.

### GET /auth/me

- Protected by `AuthenticationGuard`.
- Returns the authenticated `userId` and request ID when context contains a user ID.
- Missing context is converted to `401 Unauthorized`.

## 4. Boundary finding

The canonical HTTP adapter is confirmed to be `apps/api/src/infrastructure/auth/auth.controller.ts`.

The earlier uncertainty about the adapter location is resolved. No parallel controller or alternative HTTP authentication boundary should be introduced.

## 5. Error serialization gap

The required correction is localized to the infrastructure HTTP boundary:

`Application Result/Error` → `HTTP semantic mapping` → `safe public response`

The adapter must not:

- parse localized text;
- expose internal infrastructure details;
- collapse validation and conflict semantics;
- use English UI copy as an API contract;
- leak account-existence information in recovery/verification flows.

The adapter should consume stable machine-readable authentication error codes and map them to approved HTTP semantics while preserving security policy.

## 6. Scope guard

This audit does **not** authorize implementation of Verification, Recovery, Reset, Rate Limit, or Session Expiry. Those capabilities remain required by Founder-approved Option A but require their own application contracts and security decisions.

No production code, schema, token, visual design, or runtime harness was changed by this audit.

## 7. Readiness decision

**Canonical HTTP Adapter Map:** PASS

**Slice A implementation target:** RESOLVED

**Safe to implement the minimal error-serialization correction:** YES, subject to the existing governance gate and regression-test requirement.

**Safe to implement all 20 states:** NO — lifecycle contracts remain incomplete.

**Visual Freeze:** NOT READY
