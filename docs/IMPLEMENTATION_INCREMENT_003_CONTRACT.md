# DECIVEXA — Implementation Increment 003 Contract

**Status:** DRAFT — FOUNDER GATE REQUIRED  
**Base:** `main` after TD-09 Increment 002 closure  
**Architecture:** `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`  
**Purpose:** Define the smallest safe foundation increment for deterministic Personal State and User Context without authorizing implementation.

## 1. Governance Rule

This document is a scope and implementation contract proposal only. It does **not** authorize coding, schema changes, deployment, merge, or any material architecture change.

Implementation may begin only after explicit Founder approval of this exact contract.

## 2. Objective

Establish a deterministic, auditable foundation for representing and retrieving a user's current personal state and base context, so future Goal OS, Personal Intelligence, Memory and Decision capabilities have a reliable source-of-truth without making AI authoritative.

The increment must preserve the principle that authoritative state belongs to the deterministic Core, not to an LLM or agent.

## 3. In Scope

### 3.1 Domain model
Define a minimal Personal State aggregate with:
- stable authenticated user ownership;
- explicit state fields limited to agreed baseline context;
- value provenance (`declared` or `observed` where applicable);
- recorded timestamps for creation/update;
- deterministic identity and ownership rules;
- explicit state version/revision semantics sufficient to prevent silent historical overwrite.

### 3.2 Persistence
Introduce the minimum relational persistence required for the Personal State aggregate.

Requirements:
- user-scoped ownership enforced at the application boundary and persistence query boundary;
- no cross-user reads/writes;
- no storage of secrets or authentication credentials in Personal State;
- migration must be reversible at the operational level for this increment;
- no destructive migration without explicit additional approval.

### 3.3 API contract
Provide a minimal authenticated API to:
- read the current user's Personal State;
- create/initialize state when absent;
- update only fields permitted by the contract;
- return deterministic validation errors;
- expose provenance and timestamps needed for auditability.

No generic admin endpoint and no cross-user access endpoint is permitted.

### 3.4 Verification
Add automated verification for:
- authenticated ownership;
- unauthenticated rejection;
- cross-user access rejection;
- deterministic validation;
- create/read/update behavior;
- revision/timestamp behavior;
- persistence round-trip;
- migration application;
- build/typecheck/tests;
- post-merge verification on `main`.

## 4. Explicit Non-Goals

The following are **out of scope** and must not be implemented under Increment 003:

- LLM integration;
- AI Gateway;
- Agent Runtime;
- Memory Intelligence or semantic memory;
- Personal Digital Twin;
- Goal Intelligence or Goal Discovery;
- Growth Navigation Engine;
- Progress Intelligence;
- recommendations or predictive scoring;
- vector database or dedicated search infrastructure;
- cloud/vendor selection;
- mobile application/infrastructure;
- production deployment;
- background agents or autonomous actions;
- behavioral inference beyond explicitly supported provenance;
- personality/psychological trait inference;
- unrelated application feature expansion.

## 5. Data Semantics

Personal State is a **current-state foundation**, not a permanent personality profile.

Rules:
1. `declared` data represents an explicit user-provided statement.
2. `observed` data may only represent an explicitly defined system observation and must retain provenance.
3. The system must not silently convert an observation into a permanent identity trait.
4. Historical information must not be silently overwritten when the contract requires revision history.
5. Absence of data must not be treated as a negative fact.
6. AI, if introduced in a later increment, cannot become the authoritative writer of state without a separately approved architecture decision.

## 6. Security and Privacy

- Every read/write is scoped to the authenticated subject.
- Authorization must be enforced server-side; client-provided user IDs are not trusted.
- Personal State must not contain passwords, tokens, session secrets or other authentication secrets.
- No external provider or third-party data processor is introduced by this increment.
- No new telemetry collection is authorized beyond what is required for auditable operation.
- Error responses must not leak another user's existence or state.
- Tests must explicitly cover missing/invalid authentication and cross-user access.

## 7. Migration and Rollback

Because this increment introduces persistence, migration controls are mandatory.

Acceptance requires:
- forward migration generation;
- migration application on the approved PostgreSQL line;
- deterministic test database setup;
- reviewed rollback/recovery strategy;
- no destructive data migration;
- failed migration behavior documented and testable where supported by the existing migration tooling.

Operational rollback for an application release must not require destructive deletion of user data.

## 8. API Contract Constraints

The exact endpoint names and DTO field names must be finalized during implementation review, but the contract must remain within these capabilities:

- `GET` current authenticated Personal State;
- `POST` initialize when no state exists, or equivalent idempotent initialization semantics;
- `PATCH`/equivalent partial update of contract-approved fields;
- no arbitrary field injection;
- no user-id path parameter for self-service state operations unless authorization derives and verifies the authenticated subject.

Any endpoint or field that materially expands this contract returns to Founder Gate.

## 9. Acceptance Criteria

Increment 003 may be considered implementation-complete only when all are true:

1. Personal State has an explicit deterministic domain model.
2. Persistence exists only for the approved model.
3. Authenticated users can access only their own state.
4. Unauthenticated access is rejected.
5. Cross-user access attempts are rejected.
6. Validation is deterministic and tested.
7. Provenance semantics are represented and preserved.
8. Revision/timestamp semantics prevent silent state corruption.
9. PostgreSQL migration is generated and applied successfully.
10. Typecheck, tests and build pass.
11. Runtime API verification passes.
12. Security/negative tests pass.
13. CI evidence is produced for the implementation commit.
14. PR scope review confirms no non-goal entered the increment.
15. Post-merge verification on `main` succeeds for the exact merge commit.

## 10. Evidence Requirements

Required evidence package:
- implementation commit SHA;
- migration output;
- unit/integration/architecture test results;
- runtime API verification;
- negative security verification;
- CI run ID(s);
- artifact/digest where produced;
- PR diff/scope review;
- merge commit SHA;
- post-merge CI run tied to that exact merge SHA.

## 11. Architecture Compliance

Increment 003 must remain compatible with:
- `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`;
- TD-08 technology baseline;
- deterministic Core authority;
- evidence-before-opinion governance;
- privacy by design;
- minimal user-input philosophy.

This increment must not create a parallel user model that later conflicts with the Personal Intelligence Core. The implementation must remain a replaceable/foundational boundary rather than prematurely implementing the full Human Understanding System.

## 12. Rollback / Stop Conditions

Stop implementation and return to Founder Gate if:
- schema scope expands beyond this contract;
- a new external provider is required;
- AI/LLM becomes a runtime dependency;
- user-data collection expands materially;
- destructive migration is proposed;
- authorization semantics require architecture changes;
- a new persistence technology is proposed;
- any non-goal is introduced;
- evidence cannot establish ownership/security guarantees.

## 13. Proposed Branch

`feat/td09-increment-003-personal-state-context-contract`

The branch contains this contract only. It is intentionally **not** an implementation branch.

## 14. Founder Gate

**Decision required:** Approve or reject this exact Increment 003 Contract before implementation begins.

**Current decision:** `PENDING FOUNDER APPROVAL`
