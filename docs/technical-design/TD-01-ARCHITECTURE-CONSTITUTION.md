# TD-01 — Architecture Constitution & Document Authority

**Status:** Proposed technical contract  
**Gate:** Technical Design Gate  
**Owner:** Founder / Owner — Parsa Kiamanesh

## Objective

Ensure every human or AI contributor can determine which project artifact is authoritative without informal clarification.

## Authority hierarchy

1. Founder-approved Architecture Constitution / canonical baseline.
2. Founder-approved Architecture Decision Records (ADRs) that explicitly supersede a prior decision.
3. Founder-approved technical design contracts.
4. Approved phase/implementation specifications.
5. Explanatory research, benchmark notes, prototypes and exploratory documents.
6. Generated implementation artifacts.

A lower-level artifact cannot override a higher-level artifact.

## Normative vs explanatory

Normative documents use explicit language such as MUST, MUST NOT, REQUIRED, SHOULD and MAY. Research and explanatory documents are non-normative unless explicitly promoted through an approved ADR.

## Conflict resolution

When two artifacts conflict:

1. stop the affected implementation/design decision;
2. identify both artifacts and their versions/commits;
3. determine whether an approved ADR already resolves the conflict;
4. otherwise create an ADR proposal;
5. obtain explicit Founder approval for any material architectural change;
6. mark the superseded decision and preserve its history;
7. update affected contracts and traceability references.

No conflict is resolved by silently choosing the newer file.

## Supersession

Superseded documents remain in Git history and are marked superseded. They must not remain discoverable as active normative guidance without a clear status marker.

## Required metadata

Every normative architecture document MUST contain: status, owner, date, scope, authority level, related decisions, and supersession state where applicable.

## ADR mechanism

ADR IDs use `ADR-NNN`. Required fields: title, status, context, decision, alternatives considered, consequences, FIS impact, security/privacy impact, performance impact, Founder approval, and supersedes/superseded-by references.

## Acceptance criteria

- A contributor can identify the active canonical source without asking informally.
- Conflicts produce an explicit decision record.
- Superseded guidance cannot silently become active.
- Every material architectural decision is traceable to an approved ADR.
