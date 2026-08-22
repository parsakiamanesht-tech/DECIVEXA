# DECIVEXA Current State

## 1. Repository Identity

Repository: `parsakiamanesht-tech/DECIVEXA`

Default branch at documentation creation: `main`.

Documentation consolidation branch: `docs/decivexa-source-of-truth`.

## 2. Lifecycle / Recovery State

The known recovery baseline is **L2.1**.

Recorded status:

**L2.1 = STATIC VERIFIED / RUNTIME BLOCKED**

A recovery baseline was externally preserved as a 46-file snapshot. A final recovery bundle was also built and preserved as `DECIVEXA-L2.1-FINAL-RECOVERY-BUNDLE.zip`.

Latest recorded Recovery Anchor:

`5133626acff35aa8aaaf3c72614f40bc79ce679b`

Original recovery baseline commit recorded in project history:

`7d8b561` — `DECIVEXA L2.1 recovery baseline`.

## 3. Runtime Wiring Already Addressed

The known remediation work included static verification of:

- shared TypeORM DataSource wiring through `dataSourceFactory`
- transactional context bootstrap
- repository dependency-injection structure
- Throttler wiring

These statements describe the recorded recovery state; they are not a substitute for fresh runtime verification.

## 4. Runtime Constraints

The earlier sandbox could not install npm dependencies because registry egress was blocked and did not provide PostgreSQL/container runtime capability.

Therefore:

- static verification can be performed from repository evidence
- runtime claims require an external capable environment
- lifecycle advancement must not be based solely on static inspection

## 5. Current Drizzle Investigation State

The investigation has established the following evidence pattern:

`Drizzle Kit → PostgreSQL → backwardCompatiblePgSchema → version 7 → safeParse(raw snapshot) → 0002 malformed → 0003 malformed`

Observed parser errors include:

- `0002_snapshot.json data is malformed`
- `0003_snapshot.json data is malformed`

**Proven:** the affected snapshots are malformed according to the parser/schema validation path.

**Not yet proven:** the exact field or structural value responsible for the malformed condition.

No architectural change should be made merely to eliminate the error without first establishing the exact cause with evidence.

## 6. Current Development Governance

Development should remain controlled and evidence-driven. When a change is required:

1. establish the repository state
2. identify the exact evidence
3. make the smallest justified change
4. verify it
5. record the result
6. preserve recovery ability

## 7. Documentation Consolidation Goal

This directory is now intended to become the durable repository-level context for DECIVEXA so that a new implementation agent can reconstruct the product and architectural direction without relying on a single chat history.
