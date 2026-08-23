# Decision Record — Personal Intelligence Data-Domain Materiality

## A. Decision Identity

- **Title:** Decision Record — Personal Intelligence Data-Domain Materiality
- **Decision ID:** `FD-PI-MATERIALITY-001`
- **Date:** 2026-08-23
- **Status:** FOUNDER-APPROVED DECISION RECORD
- **Authority:** Parsa Kiamanesh — Originator, Founder & Owner of DECIVEXA

## B. Decision

The Founder determines that the introduction of the Personal Intelligence
data domain (Personal Intelligence Core Phases 1–9, commits `05f6878`
through `b6e977c`) constitutes a **MATERIAL CHANGE** as that category is
described by `docs/FOUNDER_APPROVAL_RECORD_ARCH_TD08.md` condition #2 and
`docs/ARCHITECTURE_FREEZE_BASELINE.md` rule #8, and therefore falls within
the class of changes those rules require Founder approval and a decision
record for.

## C. Rationale

The materiality classification is a Founder governance determination made
in the context of Phase 10G/10G.1 governance remediation. No rationale
beyond this determination itself is asserted by this record.

## D. Authorization Boundary

This decision classifies and reconciles the governance state of the
already-existing material change described in Section B. It does **not**
constitute:

- prior authorization (it was not in effect before this decision's
  effective date);
- retroactive implementation authorization;
- future Build Authorization under TD-09 or any equivalent gate;
- authorization for any new Personal Intelligence implementation.

## E. Effective Point

This decision becomes effective on **2026-08-23**, the actual Founder
approval date. It is not backdated to any Personal Intelligence
implementation commit date.

## F. Relationship to Existing Implementation

This decision references the Personal Intelligence implementation range
`05f6878` through `b6e977c` on `main`. Those commits remain historical
evidence of implementation having occurred. They are not, and must not be
read as, evidence of prior authorization for that implementation.

## G. Future-Work Restriction

Any future Personal Intelligence implementation must use a new, ordinary,
prospective Implementation Increment Contract — following the pattern of
`docs/IMPLEMENTATION_INCREMENT_002_CONTRACT.md` and
`docs/IMPLEMENTATION_INCREMENT_003_CONTRACT.md` — and must pass the
applicable Founder approval and TD-09 Build Authorization gate before
execution begins.

## Related Record

See `docs/gates/PERSONAL-INTELLIGENCE-GOVERNANCE-REMEDIATION-RECORD.md`
for the corresponding Governance Remediation Record.
