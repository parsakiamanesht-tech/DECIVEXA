# DECIVEXA Recovery Baseline

## Purpose

This document defines the recovery anchors and rules that protect DECIVEXA from accidental architectural or repository damage.

## Known Baseline

- Lifecycle: **L2.1**
- State: **STATIC VERIFIED / RUNTIME BLOCKED**
- Baseline snapshot: **46 files**, externally preserved
- Original recovery commit: `7d8b561` (`DECIVEXA L2.1 recovery baseline`)
- Latest recorded Recovery Anchor: `5133626acff35aa8aaaf3c72614f40bc79ce679b`
- Final recovery bundle: `DECIVEXA-L2.1-FINAL-RECOVERY-BUNDLE.zip`

## Recovery Rules

1. Never treat an unverified working tree as the only copy of important architecture.
2. Before risky migrations or architecture changes, create a new recoverable checkpoint.
3. Record the exact commit SHA for each approved baseline.
4. Preserve evidence bundles when runtime infrastructure is unavailable.
5. Do not overwrite a known-good recovery anchor merely because a later experiment appears promising.
6. Recovery state and current development state must be distinguishable.

## Runtime Boundary

The prior development environment had no usable PostgreSQL/container runtime and blocked npm registry installation. Consequently, L2.1 remained runtime-blocked even after static remediation.

A future lifecycle transition requires actual runtime evidence appropriate to the component being verified.

## Migration Safety

Migration-related changes are high-risk because they can affect schema history and future deployability. Before accepting such changes:

- inspect current migration history
- inspect schema configuration
- verify generated artifacts
- run the relevant validation in a real capable environment
- preserve the previous working baseline
- document the exact evidence

## Recovery Principle

The goal is not merely to be able to undo code. The goal is to be able to reconstruct **what DECIVEXA was, why it was that way, and which state was verified**.
