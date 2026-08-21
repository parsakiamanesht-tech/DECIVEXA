# DECIVEXA — Implementation Increment 002 Contract

**Status:** PROPOSED — NOT AUTHORIZED
**Architecture Baseline:** `DECIVEXA-ARCH-FREEZE-001 / v1.0.0`
**Technology Baseline:** `TD-08`
**Governance Gate:** `TD-09`

## Purpose

Define the smallest next implementation increment required to close TD-09 readiness evidence without silently expanding into AI, agents, memory, Personal Intelligence, cloud selection, mobile infrastructure, or other deferred capabilities.

## Scope

Increment 002 is limited to **verification-infrastructure and foundation-readiness alignment**:

1. Align API verification PostgreSQL image with the TD-08 approved PostgreSQL 18.x line.
2. Preserve the existing API verification sequence and authentication verification already proven on the merged foundation.
3. Add only the repository-level evidence/documentation needed to demonstrate the approved database line and migration verification environment.
4. Define, but do not claim completion of, migration recovery/rollback and backup/restore evidence requirements unless executable evidence is produced within this increment.

## Explicit Non-Goals

This increment does **not** authorize:

- new domain features;
- AI Gateway implementation;
- Agent Runtime implementation;
- Memory persistence;
- Personal Intelligence implementation;
- dedicated search/vector infrastructure;
- cloud/vendor selection;
- mobile implementation;
- production deployment;
- material architecture changes;
- expansion or redesign of authentication.

## Architecture Boundaries Affected

Only the following boundaries may be touched:

- CI verification infrastructure;
- local/CI PostgreSQL test environment;
- migration verification evidence;
- narrowly scoped documentation required by TD-09.

Application domain contracts and authoritative architecture boundaries must remain unchanged.

## Acceptance Criteria

AC-01 — CI provisions PostgreSQL 18.x (supported 18.x minor) instead of PostgreSQL 16.

AC-02 — Existing typecheck, architecture/workspace tests, migration generation, migration application, database connectivity, build, application startup and applicable authentication runtime verification continue to pass.

AC-03 — The workflow makes the database version used for verification explicit and auditable.

AC-04 — No new application capability is introduced outside the defined scope.

AC-05 — The resulting commit remains compliant with `DECIVEXA-ARCH-FREEZE-001` and TD-08.

AC-06 — If migration recovery/rollback or backup/restore is not executable in this increment, the result records the exact deferred evidence and why it is outside this increment rather than marking it PASS.

## Required CI Evidence

- workflow configuration diff;
- PostgreSQL 18.x service startup;
- migration generation;
- migration application;
- database connectivity;
- build/typecheck;
- application startup;
- applicable runtime verification;
- cleanup.

## Security / Privacy Impact

No new user-data capability is introduced. No new external provider is introduced. No secrets or production credentials are required. Existing security controls remain unchanged.

## Data / Migration Impact

The increment changes the verification database version only. It must not introduce a new production schema migration unless separately authorized. Any migration behavior observed in CI must be recorded as evidence, not treated as permission for unrelated schema expansion.

## Rollback / Recovery

The primary rollback is reverting the CI verification-image/configuration change. Application production data is not changed by this increment. Database recovery/backup evidence remains a separate TD-09 criterion unless executable evidence is intentionally added and verified.

## Material Founder Decisions Required

None are requested by this contract beyond authorization to proceed with this narrowly scoped increment. Any discovery requiring architecture, technology baseline, cloud/vendor, security boundary, data-authority, or scope change must stop execution and return to Founder Gate.

## Gate Rule

This document is a **scope contract only**. It does not grant implementation authorization.

Implementation may begin only after the Founder explicitly approves this Increment 002 contract **and** TD-09 records Build Authorization.

## Current Decision

**Increment 002: PROPOSED / NOT AUTHORIZED**
