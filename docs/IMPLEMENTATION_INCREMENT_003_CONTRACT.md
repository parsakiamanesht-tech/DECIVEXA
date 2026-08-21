# DECIVEXA — Implementation Increment 003 Contract

**Status:** FOUNDER APPROVED — BUILD AUTHORIZATION GRANTED FOR INCREMENT 003  
**Approval date:** 2026-08-21  
**Base:** `main` after TD-09 Increment 002 closure  
**Architecture:** `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`  

## 1. Governance Rule

Founder approval applies **only** to this exact Increment 003 contract. It authorizes implementation within the scope below; it does not authorize architecture expansion, unrelated features, deployment, or future increments.

Any material deviation must stop implementation and return to Founder Gate.

## 2. Objective

Establish a deterministic, auditable foundation for representing and retrieving a user's current personal state and base context, so future Goal OS, Personal Intelligence, Memory and Decision capabilities have a reliable source-of-truth without making AI authoritative.

The deterministic Core remains the authoritative state owner. AI/LLM/agents are not part of this increment.

## 3. In Scope

- Minimal Personal State aggregate with authenticated user ownership.
- Explicit baseline state fields only.
- Provenance (`declared` or `observed`) where applicable.
- Creation/update timestamps and deterministic revision semantics.
- Minimum relational persistence required for the approved aggregate.
- Server-side ownership and authorization enforcement.
- Minimal authenticated self-service API: read current state, initialize when absent, update approved fields.
- Deterministic validation and error semantics.
- Automated ownership, authentication, cross-user isolation, CRUD, revision/timestamp and persistence tests.
- PostgreSQL migration, build/typecheck/tests, CI evidence and post-merge verification.

## 4. Explicit Non-Goals

AI/LLM, AI Gateway, Agent Runtime, Memory Intelligence, Personal Digital Twin, Goal Intelligence/Discovery, Growth Navigation, Progress Intelligence, recommendations/predictive scoring, vector/search infrastructure, cloud/vendor selection, mobile, production deployment, background agents/autonomous actions, behavioral inference beyond explicit provenance, personality/psychological trait inference, and unrelated application expansion are prohibited.

## 5. Data Semantics

1. `declared` means explicitly provided by the user.
2. `observed` means an explicitly defined system observation and retains provenance.
3. Observations must not silently become permanent identity traits.
4. Required historical revisions must not be silently overwritten.
5. Missing data is not a negative fact.
6. AI/agents cannot become authoritative state writers under this increment.

## 6. Security and Privacy

- Every operation is scoped to the authenticated subject.
- Client-supplied user IDs are not trusted for authorization.
- Personal State contains no passwords, tokens, session secrets or authentication credentials.
- No external provider or third-party processor is introduced.
- No new telemetry collection beyond auditable operation is authorized.
- Error responses must not leak another user's state or existence.
- Missing/invalid authentication and cross-user access are mandatory negative tests.

## 7. Migration and Rollback

Persistence changes require:
- forward migration generation;
- successful application on PostgreSQL 18.x;
- deterministic test database setup;
- reviewed rollback/recovery strategy;
- no destructive data migration;
- documented/testable failure and retry behavior where supported by existing tooling.

Application rollback must not require destructive deletion of user data.

## 8. API Contract Constraints

The implementation must remain limited to:
- `GET` current authenticated Personal State;
- `POST` initialize when absent, or equivalent idempotent initialization;
- `PATCH`/equivalent partial update of approved fields;
- deterministic validation errors;
- no arbitrary field injection;
- no cross-user/self-service user-id override.

Endpoint/field additions that materially expand this contract require a new Founder Gate.

## 9. Acceptance Criteria

1. Explicit deterministic Personal State domain model.
2. Persistence only for approved model.
3. Authenticated users access only their own state.
4. Unauthenticated access rejected.
5. Cross-user access rejected.
6. Deterministic validation tested.
7. Provenance represented and preserved.
8. Revision/timestamp semantics prevent silent corruption.
9. PostgreSQL migration generated and applied.
10. Typecheck, tests and build pass.
11. Runtime API verification passes.
12. Negative security tests pass.
13. CI evidence produced for implementation commit.
14. PR scope review confirms no non-goal entered.
15. Post-merge verification succeeds for exact merge commit.

## 10. Evidence Requirements

Implementation SHA, migration output, tests, runtime verification, negative security verification, CI run IDs, artifact/digest, PR scope review, merge SHA and post-merge CI tied to the exact merge SHA are required for closure.

## 11. Architecture Compliance

Implementation must remain compatible with `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`, TD-08, deterministic Core authority, evidence-before-opinion governance, privacy by design and minimal user-input philosophy. It must not create a competing user model or prematurely implement the full Human Understanding System.

## 12. Stop Conditions

Stop and return to Founder Gate if schema scope expands, an external provider is required, AI becomes a runtime dependency, user-data collection expands materially, destructive migration is proposed, authorization requires architecture changes, a new persistence technology is proposed, a non-goal enters the diff, or security/ownership guarantees cannot be evidenced.

## 13. Authorized Branch

`feat/td09-increment-003-personal-state-context-contract`

Implementation is authorized on this branch or a dedicated implementation branch derived from the approved contract commit, provided the exact scope remains intact.

## 14. Founder Gate Record

**Founder:** Parsa Kiamanesh  
**Decision:** APPROVED  
**Authorization:** Build/implementation of Increment 003 within this contract is authorized.

**Merge remains separately gated.** Build Authorization is not Merge Authorization.
