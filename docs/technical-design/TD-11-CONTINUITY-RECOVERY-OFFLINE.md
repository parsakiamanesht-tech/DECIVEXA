# TD-11 — Continuity, Recovery & Offline Contract

**Status:** Proposed technical contract

## Objective

Ensure DECIVEXA remains useful, safe and truthful during AI, network, cloud or resource failures.

## Continuity levels

**Level 1 — AI failure:** deterministic core remains fully usable; AI-enhanced capabilities degrade gracefully.

**Level 2 — Cloud/API failure:** local essential state and pending events remain usable; secure synchronization resumes later.

**Level 3 — Extended outage:** user retains a secure local representation of essential goals, routines, progress, important memories and Personal Constitution subject to device/security policy.

## Last Known Good State

The system MUST maintain an identifiable valid state containing, as applicable, active goals, path/stage, daily actions, routines, habits, constraints, valid recommendations and applicable deterministic rules.

Stale intelligence MUST be labeled as stale/current-last-known, never presented as newly generated analysis.

## Offline operation

Essential actions SHOULD be locally recordable with secure storage and an explicit pending-event queue. Synchronization MUST use the TD-03 event model and must not rewrite history.

## Safe Mode

Safe Mode MAY activate for AI failure, degraded storage/database, unstable network, security incident or severe resource constraints. It preserves core data, user controls, essential execution and security while disabling risky/nonessential capabilities.

## AI recovery

After recovery:

`Offline Events → Validate/Sync → Analyze New Evidence → Detect Drift → Update Model → Re-evaluate Path if Needed`

Recovery MUST interpret new evidence without fabricating events and MUST NOT rewrite authoritative history.

## Disaster recovery

Final RPO/RTO values MUST be established from threat/business impact analysis. Backup/restore testing is required before production readiness.

## Acceptance criteria

- AI failure cannot cause data loss.
- Essential operations continue without continuous AI.
- Offline events synchronize deterministically.
- Last Known Good State is identifiable.
- Recovery cannot rewrite historical truth.
- Extended outage behavior is security-conscious.
