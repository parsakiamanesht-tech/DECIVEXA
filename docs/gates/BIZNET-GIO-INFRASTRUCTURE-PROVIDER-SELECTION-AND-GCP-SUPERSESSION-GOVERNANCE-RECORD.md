# Biznet GIO Infrastructure Provider Selection and GCP Supersession Governance Record

## 1. Document Identity

- **Document title:** Biznet GIO Infrastructure Provider Selection and GCP Supersession Governance Record
- **Governance Record ID:** `GOVERNANCE-BIZNET-GIO-PROVIDER-DIRECTION-001`
- **Date:** 2026-09-02
- **Founder:** Parsa Kiamanesh
- **Status:** **FOUNDER-APPROVED PROVIDER DIRECTION — IMPLEMENTATION NOT AUTHORIZED**
- **Baseline at time of creation:** branch `main`, `HEAD = origin/main =
  0bf2684618dd9fb9878d60844a55dee6cf3f00df`, divergence `0/0`. Protected
  file `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` (MD5
  `972ad36e523aa42e540f2c28a3aac801`) unchanged by this document.
- **Related prior audit (read-only, this session):** Infrastructure
  Provider Decision Audit — GCP → Biznet GIO (conversational record,
  2026-09-02), whose evidence this record draws on.

This document is a new, additive governance record. It does not modify,
overwrite, or delete any existing file.

---

## 2. Founder Decision

**Founder:** Parsa Kiamanesh
**Decision:** DECIVEXA Infrastructure Direction = **Biznet GIO**

This is a **present-day** Founder decision, dated 2026-09-02. It is not
represented, and must never be represented, as a historical decision
predating this date, and it does not retroactively describe any prior
session, commit, or governance record as having selected Biznet GIO.

This decision establishes Biznet GIO as the **target provider direction**
for future DECIVEXA infrastructure architecture reconciliation and
implementation. It is a direction decision, not an implementation
authorization.

---

## 3. Decision Scope

**This decision changes:**

- the target infrastructure/provider direction for DECIVEXA;
- the frame for future provider-specific architecture work;
- the frame for future infrastructure implementation planning;
- the frame for future provider-specific security/integration decisions.

**This decision does NOT, by itself, authorize:**

- infrastructure implementation;
- Terraform changes (creation, modification, or deletion);
- provisioning of any kind;
- cloud/provider account creation;
- provider contact or transmission of any consultation request;
- DNS changes;
- networking changes;
- secrets deployment or population;
- CI/CD deployment configuration changes;
- production deployment;
- application-code changes;
- AI Gateway production deployment;
- database provisioning;
- migration execution;
- commit or push of any file, including this one.

---

## 4. Historical GCP Reconciliation

Accurately recorded, without alteration of any historical file:

- `docs/gates/INCREMENT-008-GCP-CLOUD-SELECTION-AND-DEPLOYMENT-REVIEWER-GOVERNANCE-RECORD.md`
  represented a prior GCP direction/design decision (Decision A: GCP as
  "initial cloud/platform," evaluated against TD-08 §12 criteria; Decision
  B: Parsa Kiamanesh as human deployment reviewer).
- `docs/gates/INCREMENT-009-SECURE-AI-RUNTIME-INFRASTRUCTURE-FOUNDATION-GCP.md`
  is a GCP-specific Secure AI Runtime Infrastructure Foundation
  contract/design record.
- **Neither record represents an executed production GCP deployment.**
  Both remain **UNTRACKED** in git history (verified: `git log` returns
  zero commits for either path; neither appears in `git ls-files`) —
  Category B, self-declared governance artifacts, never committed.
- **No GCP resources were provisioned or applied.** `infra/gcp/` (9
  files, 24 declared resources) and `infra/gcp-bootstrap/` (8 files, 6
  declared resources) exist as committed Terraform *source* only
  (committed via `f37580a` and `d23b183`). **No `.tfstate` file exists
  anywhere in the repository, and no CI workflow references `terraform`
  at all.**
- **Therefore, no infrastructure migration away from a live GCP
  environment is required** — there is no live GCP environment to migrate
  away from.

**The present Founder-approved Biznet GIO direction supersedes GCP as the
TARGET PROVIDER DIRECTION for future DECIVEXA infrastructure work.**

"Supersedes" is used precisely here: it means Increment 008 and Increment
009 no longer define the current target provider direction going
forward. It does **not** mean:

- the historical documents are erased, deleted, or invalidated as
  historical artifacts — they remain accurate records of what was
  previously designed and self-declared, on the date they were dated;
- GCP infrastructure was ever implemented and then migrated — no such
  implementation ever existed;
- any retroactive Founder approval of Biznet GIO existed before this
  document's date.

---

## 5. Increment 009 Status

**Increment 009 implementation remains NOT AUTHORIZED.**

This status is unchanged by the present decision — it was already "DESIGN
FINALIZED — CONTRACT ARTIFACT — IMPLEMENTATION NOT AUTHORIZED" before this
record, and this record does not change that status.

Because Increment 009 contains GCP-native assumptions and mechanisms —
including GCP-native OIDC/IAM identity mechanisms (INV-006), a
Google-issuer-specific token verification design, and GCP Secret Manager
as the designated secret backend — it **must not** be implemented as
currently written under a Biznet GIO target. Any future implementation
work in this area first requires the provider-specific mechanisms
described in Increment 009 (and related records, §6) to be reconciled or
revised for Biznet GIO.

**Increment 009 is not modified by this record.** Its file content is
untouched.

---

## 6. GCP-Specific Architecture Reconciliation Boundary

GCP-specific assumptions or mechanisms may exist, in whole or in part, in
other governance/design records, including but not necessarily limited
to:

- Increment 009 (`INCREMENT-009-SECURE-AI-RUNTIME-INFRASTRUCTURE-FOUNDATION-GCP.md`)
- Increment 010 (`INCREMENT-010-PROVIDER-ROUTING-CREDENTIAL-CUSTODY-AND-GATEWAY-CONTROL-MODEL-GOVERNANCE-RECORD.md`)
- Increment 011 (`INCREMENT-011-ZONE-3-GATEWAY-TECHNICAL-SIZING-GOVERNANCE-RECORD.md`)
- Increment 013 (`INCREMENT-013-ZONE-3-GATEWAY-FOUNDER-DECISION-GATE-GOVERNANCE-RECORD.md`)
- Increment 016 (`INCREMENT-016-ZONE-3-GATEWAY-RUNTIME-AND-CREDENTIAL-ARCHITECTURE-GOVERNANCE-RECORD.md`)
- Increment 019 Phase F (`INCREMENT-019-PHASE-F-DECISION-CLOSURE-ZONE-2-IDENTITY-AND-AI-PROVIDER-GOVERNANCE-RECORD.md`)

This record does **not** assume every one of these documents must be
changed. Some content within them may be provider-neutral and directly
reusable (e.g. identity-separation principles, no-fallback rules);
other content is GCP-specific mechanism detail (e.g. Cloud Run's `$PORT`
convention, the Google-fixed OIDC issuer, Secret Manager as a named
backend) that would require redesign under a different provider.

A **later, separate, read-only provider-specific reconciliation audit**
must determine, document by document and decision by decision, which
prior decisions are:

- provider-neutral and reusable as-is;
- GCP-specific but portable in substance to an equivalent Biznet
  mechanism;
- GCP-specific and requiring redesign for Biznet;
- historical only, and no longer applicable to the current target
  direction.

**That redesign is explicitly not performed by this record.**

---

## 7. Biznet Capability Verification Boundary

Biznet GIO is now the Founder-approved **TARGET PROVIDER DIRECTION**.

**Biznet capability verification is NOT COMPLETE.**

The following must be externally verified — by direct technical
consultation with Biznet, not inferred from marketing material, general
reputation, or assumption — before any implementation authorization can
be considered:

- container hosting/runtime suitability;
- Node.js container deployment model;
- PostgreSQL 18 availability/suitability (managed or self-managed);
- private networking capability;
- internal-only AI Gateway reachability (the Gateway must never be
  publicly reachable under any Biznet configuration);
- service-to-service authentication/identity mechanism availability;
- secure secret storage;
- container registry availability;
- CI/CD authentication and deployment credentialing model;
- outbound HTTPS restriction/allowlisting capability;
- TLS termination support;
- logging and retention capability;
- backup capability;
- RPO/RTO figures;
- disaster recovery procedure;
- DDoS/network security controls;
- monitoring/observability capability;
- pricing and capacity/scaling model;
- production support characteristics (SLA, support tiers).

**None of the above is claimed as verified by this record.** The
existence of Biznet as a company, product line, or website is not
evidence of any specific capability listed above. No Biznet capability is
presented as fact anywhere in this document.

---

## 8. Existing DECIVEXA Infrastructure Requirements

The following requirements are already established in
`docs/DECIVEXA/CURRENT_ARCHITECTURE_AND_INFRASTRUCTURE_REQUIREMENTS_AUDIT.md`
(committed, `main`) and are recorded here for reference, **without being
redesigned**:

- approximately 2–3 small containerized Node.js services (`apps/web`,
  `apps/api`, `apps/ai-gateway`);
- the AI Gateway (`apps/ai-gateway`, "Zone-3") must never be publicly
  reachable, under any provider;
- PostgreSQL (version 18, as currently verified in CI) must be reachable
  privately from `apps/api` only;
- public HTTPS ingress only for `apps/web` and `apps/api`;
- outbound HTTPS from the AI Gateway restricted/controlled (allowlisted
  to the AI provider's API host once populated);
- secret storage for at least one API credential, with least-privilege
  runtime access (readable only by the Gateway's runtime identity);
- a container image registry;
- a CI/CD deployment path with a human production-approval gate;
- basic log retention;
- TLS termination for public endpoints.

**Exact production sizing remains UNKNOWN / requires later capacity
analysis** — no production deployment or load measurement has occurred
on any provider to date.

---

## 9. Provider-Neutral Invariants

The following invariants survive provider selection and are not altered
by this decision:

1. **Three-identity separation** — build identity, deployment identity,
   and runtime identity must remain distinct and never merged.
2. **AI Gateway internal-only network posture** — the Gateway must never
   be publicly reachable.
3. **Least-privilege secret access** — only the identity that needs a
   given secret may read it.
4. **No public exposure of the internal AI Gateway**, under any
   configuration.
5. **Restricted/controlled outbound AI-provider traffic** from the
   Gateway.
6. **Provider-agnostic application architecture** — the existing
   `AIProvider`/`ProviderAdapter` interfaces and their separation from
   Memory/Personal Intelligence/Evidence remain the governing pattern.
7. **No-fallback security rule**, where already established (no
   retry/fallback across AI providers).
8. **Human-controlled production deployment approval.**

No additional architectural invariant is introduced by this record.

---

## 10. Provider Mapping

| DECIVEXA Requirement | GCP Mechanism | Biznet Target | Current Verification Status | Future Action |
|---|---|---|---|---|
| Compute/container runtime | Cloud Run (historical/design mechanism, `infra/gcp/main.tf`, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify via Biznet consultation |
| Service identity separation | GCP service accounts + IAM (historical/design mechanism, `iam.tf`, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's identity/permission model |
| CI/CD deployment authentication | Workload Identity Federation (historical/design mechanism, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's CI credentialing options |
| AI Gateway caller authentication (Zone-2 → Zone-3) | Google-signed OIDC ID-token verification, fixed Google issuer (historical/design mechanism, Increment 009/016, design-only) | UNKNOWN / TO BE VERIFIED | Not verified — this mechanism is GCP-specific and does not port as-is | Requires provider-specific redesign after Biznet consultation |
| Secret storage | Secret Manager (historical/design mechanism, container declared only, no value, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's secret-management offering |
| Container registry | Artifact Registry (historical/design mechanism, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's registry offering |
| Network isolation | VPC (historical/design mechanism, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's private networking model |
| Outbound restriction | NAT egress allowlisting (historical/design mechanism, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's egress-control capability |
| Logging | Cloud Logging (historical/design mechanism, unapplied) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's logging/retention offering |
| PostgreSQL | No managed-database Terraform resource ever declared, on GCP either (open decision, not GCP-specific) | UNKNOWN / TO BE VERIFIED | Not verified on either provider | Verify Biznet PostgreSQL 18 availability |
| TLS termination | Not implemented in-application on GCP either; expected from ingress/hosting layer (historical/design assumption) | UNKNOWN / TO BE VERIFIED | Not verified | Verify Biznet's TLS/reverse-proxy support |

No Biznet equivalent above is fabricated or presumed to exist; each is
marked UNKNOWN / TO BE VERIFIED pending direct consultation.

---

## 11. Governance Sequence

The required next path is:

```
Founder Decision
    ↓
Biznet GIO Provider Selection Governance Record   ← THIS DOCUMENT
    ↓
Biznet Technical Capability Consultation
    ↓
Capability Verification
    ↓
Provider-Specific Architecture Reconciliation
    ↓
Provider-Specific Implementation Increment Contract(s)
    ↓
Explicit Implementation Authorization
    ↓
Implementation
    ↓
Runtime / Production Verification
    ↓
Commit / Push according to Founder authorization
```

**This record completes only the "Biznet GIO Provider Selection
Governance Record" step.** No later step in this sequence is executed,
implied as executed, or authorized by this record.

---

## 12. Biznet Consultation Boundary

`docs/DECIVEXA/BIZNET_INFRASTRUCTURE_CONSULTATION_REQUEST.md` is a
**DRAFT** document, previously identified (in the prior read-only
Infrastructure Provider Decision Audit) as **NOT YET TRANSMITTED**.

- This record does **not** send it.
- This record does **not** modify it.
- This record does **not** claim Biznet has responded to it, or to
  anything else — no Biznet response exists anywhere in the repository.

**Transmitting the consultation request requires a separate, explicit
Founder authorization**, distinct from the present provider-direction
decision.

---

## 13. Security Position

- No credentials are added by this record.
- No secrets are stored by this record.
- No provider credentials are authorized by this record.
- No provisioning is authorized by this record.
- No Terraform apply is authorized by this record.
- No CI deployment configuration is authorized by this record.
- No production endpoint is authorized by this record.

**Existing provider-specific security design — in particular the
GCP-native OIDC/IAM mechanisms described in Increment 009/016 — must be
re-evaluated against Biznet's actual capabilities before any
implementation.** This record does not perform that re-evaluation.

---

## 14. Non-Authorization Clause

**THIS RECORD DOES NOT AUTHORIZE IMPLEMENTATION.**

Specifically, this record does not authorize:

- code changes;
- Terraform changes;
- infrastructure provisioning;
- cloud account changes;
- provider contact;
- DNS changes;
- networking changes;
- secrets creation or deployment;
- CI/CD deployment changes;
- production deployment;
- migration execution;
- commit of this or any other file;
- push of this or any other file.

Any of the above requires separate, explicit Founder authorization,
given per the standing DECIVEXA governance discipline.

---

## 15. Historical Accuracy / Audit Trail

| # | Event | Evidence | Date |
|---|---|---|---|
| 1 | Prior GCP direction/design existed | `INCREMENT-008-GCP-CLOUD-SELECTION-AND-DEPLOYMENT-REVIEWER-GOVERNANCE-RECORD.md` (Category B, self-declared, untracked — confirmed by `git log`/`git ls-files` returning no results) | dated 2026-08-26 (filesystem) |
| 2 | Increment 009 GCP-specific design finalized, implementation not authorized | `INCREMENT-009-SECURE-AI-RUNTIME-INFRASTRUCTURE-FOUNDATION-GCP.md` (Category B, self-declared, untracked) | dated 2026-08-26 (filesystem) |
| 3 | Actual GCP Terraform source committed (unapplied) | commits `f37580a`, `d23b183` | 2026-08-27 |
| 4 | No GCP resources provisioned/applied | direct evidence: zero `.tfstate` files repository-wide; zero `terraform` references in any `.github/workflows/*` file | verified 2026-09-02 |
| 5 | No infrastructure migration required | derived directly from #3–#4 — there is no live GCP environment to migrate away from | verified 2026-09-02 |
| 6 | Prior read-only Infrastructure Provider Decision Audit (GCP → Biznet GIO) | conversational record, this session | 2026-09-02 |
| 7 | Present-day Founder decision: Biznet GIO is target provider direction | explicit Founder instruction, this session (§2 above) | 2026-09-02 |
| 8 | Creation of this governance record | this document | 2026-09-02 |

No historical file was altered in producing this audit trail.

---

## 16. Founder Decision Record

| Decision | Status |
|---|---|
| Biznet GIO is current target infrastructure provider | APPROVED |
| GCP remains current target provider direction | SUPERSEDED |
| Historical GCP records (Increment 008, Increment 009) preserved unmodified | YES |
| Increment 009 implementation authorized | NO |
| GCP-specific mechanism decisions in Increments 009/010/011/013/016/019 automatically reconciled to Biznet | NO — requires separate reconciliation audit (§6) |
| Biznet capability verification complete | NO |
| Biznet consultation request transmission authorized | NO — SEPARATE DECISION REQUIRED |
| Infrastructure implementation authorized | NO |
| Terraform changes authorized | NO |
| Production deployment authorized | NO |
| Commit of this document authorized | NO — SEPARATE DECISION REQUIRED |
| Push of this document authorized | NO — SEPARATE DECISION REQUIRED |

---

## 17. Explicit Next Gate

The immediate **recommended** next governance gate is:

**Biznet GIO Technical Capability Consultation / Verification.**

This is stated as a recommended next gate only. It is **not** an
authorization to execute it. A separate, explicit Founder authorization
is required before the drafted consultation request
(`BIZNET_INFRASTRUCTURE_CONSULTATION_REQUEST.md`) may be transmitted to
Biznet, or before any other capability-verification activity begins.

---

## 18. Final Determination

**BIZNET GIO: FOUNDER-APPROVED TARGET PROVIDER DIRECTION (2026-09-02).**
**GCP: SUPERSEDED AS TARGET PROVIDER DIRECTION — HISTORICAL RECORDS
PRESERVED, NOT ERASED, NOT RETROACTIVELY INVALIDATED.**
**INCREMENT 009 IMPLEMENTATION: REMAINS NOT AUTHORIZED.**
**BIZNET CAPABILITY VERIFICATION: NOT COMPLETE.**
**NO IMPLEMENTATION, PROVISIONING, PROVIDER CONTACT, COMMIT, OR PUSH IS
AUTHORIZED BY THIS RECORD.**
