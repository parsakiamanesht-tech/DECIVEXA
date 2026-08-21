# ADR-001: WEB-RESTORE Auth Foundation Boundary

## Status
Accepted

## Date
2026-08-21

## Context
PR #4 reconstructs the DECIVEXA Web Foundation layer. The implementation adds frontend authentication boundaries, API client foundations, route protection, Dashboard foundation, and Web E2E verification.

A decision is required to prevent future interpretation that this work represents a complete Authentication Platform.

## Decision
The authentication work in WEB-RESTORE is classified as an **Auth Foundation**, not a complete authentication system.

Included:
- Frontend session boundary
- Auth context foundation
- Route protection boundary
- Login/Register UI foundation
- Verification of authenticated and unauthenticated navigation behavior

Not included:
- Backend authentication service
- User persistence
- Database identity model
- Token security architecture
- Enterprise authentication policies
- Full identity platform

## Rationale
DECIVEXA requires Evidence Before Opinion and controlled architectural evolution. This boundary preserves future scalability while preventing premature expansion of authentication scope.

## Consequences
Future authentication capabilities must be introduced through separate architecture decisions and implementation gates.

PR #4 should be reviewed as Web Foundation reconstruction with verification evidence, not as completion of the DECIVEXA Auth Platform.
