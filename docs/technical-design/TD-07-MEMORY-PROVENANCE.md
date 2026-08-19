# TD-07 — Memory Provenance & Poisoning Protection

**Status:** Proposed technical contract

## Objective

Prevent incorrect or malicious information from becoming durable Personal Intelligence.

## Memory metadata

Meaningful memory/intelligence records MUST support, as applicable:

- source;
- timestamp;
- confidence;
- sensitivity;
- user-confirmed status;
- system-inferred status;
- last verification;
- review/expiration state;
- provenance chain;
- supersession/correction reference.

## Source distinction

The system MUST distinguish explicit user statements from observations and AI inferences. An inference cannot be represented as if the user stated it.

## Poisoning controls

Memory ingestion MUST consider source trust, provenance, conflict with established evidence, suspicious instruction content, and repetition designed to manufacture confidence. High-impact memories SHOULD require stronger evidence or user confirmation before influencing consequential decisions.

## Correction

Users MUST be able to correct or delete eligible memories. Correction MUST stop the incorrect memory from being treated as current truth while preserving necessary audit/history semantics.

## Verification

Time-sensitive or high-impact memories SHOULD have review/expiry policies. Stale information MUST lose influence or be revalidated according to its class.

## Acceptance criteria

- Memory origin is distinguishable.
- Inferred traits are never silently treated as user statements.
- Poisoning resistance exists at ingestion and retrieval/influence stages.
- Incorrect memories can be invalidated without rewriting authoritative history.
- High-impact memory influence is traceable.
