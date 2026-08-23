# Founder Decision — Defer Genuine Actor≠Owner Architecture

## 1. Phase Identification

PHASE 10K.3

## 2. Decision Title

Founder Decision — Defer Genuine Actor≠Owner Architecture

## 3. Baseline SHA

`6e55631350c87d8ec16272dc822cd89d63653457`

## 4. Decision Authority

Explicit Founder decision recorded in this phase (Phase 10K.3), following
review and acceptance of the Phase 10K.2 Actor Identity / Application
Enforcement Architecture Determination.

## 5. Evidence Basis

Summarized from Phase 10K.2's decisive findings, reconfirmed unchanged at
the start of this phase:

- Only two live, composition-wired application patterns exist for identity
  reaching a use-case in this repository: Evidence and Personal State.
  Both pass `RequestContext.userId` (populated exclusively from a verified
  access token in `AuthenticationGuard`) directly as the sole
  repository-query-scoping parameter.
- Neither of those live patterns — nor any other pattern in the
  repository — ever represents an authenticated actor requesting access
  to a resource that could belong to a different user. Ownership is
  enforced entirely by query-level scoping; a mismatch produces "not
  found," never a distinct actor-vs-owner comparison.
- `core/resource/workspace.governance.ts` (the only place
  `assertWorkspaceAccess`/`canAccessWorkspace` is ever called) is not
  reachable through any composition-wired path — the real, DI-registered
  `GetWorkspaceForOwnerUseCase` bypasses it entirely and leaves its own
  `RequestContext` parameter unused. It is an orphaned, non-authoritative
  precedent.
- The Increment 004 predicate
  (`canAccessPersonalIntelligenceClaim`/`assertPersonalIntelligenceClaimAccess`)
  remains PI-specific, deterministic, pure, synchronous, deny-by-default,
  ownership/action-based, fully tested, and — reconfirmed at the start of
  this phase — consumed by zero files anywhere in the repository outside
  its own module and spec.
- The Personal Intelligence use-case
  (`PersonalIntelligenceClaimUseCase`) still uses its existing
  owner-scoped `userId` flow, unchanged since its original implementation;
  no `RequestContext` parameter exists anywhere in the PI application
  layer, reconfirmed at the start of this phase.
- Calling the Increment 004 predicate with the same `userId` already used
  to scope the repository query would be tautological: the query already
  guarantees `claim.userId === userId` whenever a claim is returned at
  all, so such a call could never deny access on actor-vs-owner grounds —
  it would be defense-in-depth/explicit-intent only, not meaningful
  cross-user authorization.
- No authoritative repository evidence establishes admin access,
  delegation, shared access, impersonation, operator access, cross-user
  access, an Actor/Principal abstraction, or separate target-owner
  semantics anywhere in this repository. None of these is inferred by
  this record.

## 6. Decision

**Option (B) selected: defer genuine Actor≠Owner architecture.**

## 7. Explicit Rationale

DECIVEXA will not invent an actor-vs-owner authorization capability
merely to make the Increment 004 predicate consumable. A primitive
existing and being ready for use is not, by itself, evidence that the
capability it would require (a real distinction between actor and
resource owner) is needed. No such need is currently evidenced anywhere
in the repository. Architecture Before Accumulation and Minimum Necessary
Architecture both counsel against building a capability the system has
never actually required.

## 8. Increment 004 Status

**CLOSED and unchanged.** Not reopened, not modified, not reinterpreted
by this decision. Its correct status remains: a prepared, tested,
PI-specific authorization primitive awaiting a future evidenced consumer
boundary — not a defect, not incomplete work requiring immediate
follow-up.

## 9. Increment 005 Status

**NOT AUTHORIZED. NOT DRAFTED. NOT IMPLEMENTED.** No
`docs/IMPLEMENTATION_INCREMENT_005_CONTRACT.md` exists or is created by
this record.

## 10. Actor≠Owner Status

**DEFERRED**, pending new authoritative evidence of a real requirement
for actor and resource owner to differ (e.g., admin/operator access,
delegation, shared access, cross-user access), or an explicit future
Founder architecture decision establishing such a requirement.

## 11. RequestContext Status

`RequestContext` remains a valid, existing, reusable convention for
carrying authenticated actor identity into the application layer (as
demonstrated live by Evidence and Personal State). This decision does
**not** authorize its introduction into the Personal Intelligence
application layer, and does **not** claim that `RequestContext` itself
establishes or represents an Actor≠Owner distinction — in every place it
is actually used today, the identity it carries is used as the sole
value for both actor and resource-owner roles.

## 12. Explicit Non-Authorizations

This decision does **not** authorize:

- No Increment 005 Contract shall be created.
- No PI use-case signature shall be changed.
- No `RequestContext` shall be introduced into PI merely for this reason.
- No `actorId` parameter shall be introduced.
- No Principal/Actor abstraction shall be introduced.
- No delegation model shall be introduced.
- No admin/shared-access model shall be introduced.
- No authorization framework shall be generalized.
- No access-predicate wiring shall be added.
- No audit wiring shall be added.
- No Purpose taxonomy shall be added.
- No Consent taxonomy shall be added.
- No schema/migration shall be added.
- No HTTP/API layer shall be added.
- No AI/Agent consumer shall be added.

## 13. Reconsideration Triggers

This deferment may only be reopened by one of the following:

- authoritative evidence of admin/operator access being genuinely
  required;
- authoritative evidence of a delegation model being genuinely required;
- authoritative evidence of shared access being genuinely required;
- authoritative evidence of cross-user access being genuinely required;
- any other genuine, evidenced actor/resource-owner separation need;
- an explicit future Founder architecture decision establishing such a
  requirement, independent of the mere existence of the Increment 004
  predicate.

## 14. Historical Boundary

This decision does not rewrite Phases 1–9 or any previous governance
decision, including but not limited to the Phase 10G remediation
artifacts, the Increment 004 Contract, or the Increment 004 Closure
Record. All remain exactly as previously recorded.

## 15. Architecture Freeze Boundary

This decision does not reopen Architecture Freeze
(`docs/ARCHITECTURE_FREEZE_BASELINE.md`, unmodified) and does not modify
TD-09, TD-07, TD-08, or any prior authorization artifact.

## 16. Important Architectural Interpretation (preserved verbatim)

- Increment 004 is not defective because it is currently unused; it is a
  prepared and closed primitive awaiting a future evidenced consumer
  boundary.
- The absence of Actor≠Owner architecture is not a bug; it is an
  unevidenced capability gap that is intentionally deferred.
- DECIVEXA does not have a complete authorization architecture.
- `RequestContext` does not establish Actor≠Owner semantics.
- The current PI access predicate does not provide cross-user
  authorization.

## 17. Final Determination

**FOUNDER DECISION RECORDED — ACTOR≠OWNER ARCHITECTURE DEFERRED —
INCREMENT 005 NOT AUTHORIZED**
