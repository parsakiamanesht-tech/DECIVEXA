# TD-03 — State, Event & Consistency Model

**Status:** Proposed technical contract

## Objective

Provide deterministic, auditable state evolution for offline operation, continuous personalization and AI-assisted interpretation.

## Model

DECIVEXA distinguishes:

- **Authoritative state:** current truth owned by a domain.
- **Immutable event:** an accepted historical occurrence that records what happened.
- **Projection:** derived read model computed from authoritative events/state.
- **Interpretation:** non-authoritative analysis of evidence.
- **Recommendation:** proposed action, never historical truth.

## Event rules

Accepted domain events MUST be immutable. Corrections are represented by new events or explicit correction records; history is never overwritten to make an interpretation appear true.

Events MUST carry stable identifiers, source, timestamp, actor, schema version and sufficient correlation/idempotency information.

## Idempotency

Event consumers MUST be idempotent. Reprocessing the same event ID MUST NOT create duplicate authoritative effects.

## Ordering

Where order affects meaning, domains MUST define an ordering key and conflict policy. Distributed timestamps alone MUST NOT be treated as a universal ordering mechanism.

## Offline synchronization

Client-originated essential actions are recorded locally as pending events, then securely synchronized. Server acceptance/rejection is explicit. Conflicts are resolved by domain-specific deterministic policy, not by blindly preferring last-write-wins.

## AI boundary

AI-generated interpretations can reference events and state but cannot mutate historical events. AI may propose state changes only through validated application commands owned by the relevant domain.

## Reproducibility

Given the same valid event history and deterministic domain rules, the authoritative state MUST be reproducible.

## Acceptance criteria

- Historical events are immutable.
- Authoritative state has clear ownership.
- Duplicate delivery is safe.
- Offline synchronization has explicit conflict rules.
- AI cannot rewrite history.
- State reconstruction is deterministic under the defined rules.
