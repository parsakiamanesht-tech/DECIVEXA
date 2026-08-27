# DECIVEXA — Legal Scenario 5 Eligibility Package

**Document type:** Counsel-ready research package (not a legal opinion, not an
Architecture Freeze document, not an Implementation Contract, not a
governance authority document). This document does not authorize
infrastructure, does not authorize a commit/push of itself, and does not
resolve the underlying legal question — only qualified counsel and a
specific provider's compliance function can do that (§17, §20).
**Status:** RESEARCH COMPLETE — SCENARIO 5 REMAINS THEORETICAL / UNRESOLVED.
**Date:** 2026-08-27.
**Origin:** Consolidates six read-only investigation passes performed earlier
in this session (US sanctions law, EU/Swiss sanctions law, entity-structure
analysis, and provider-by-provider primary-source review) into a single
counsel-ready package, per Founder directive.

---

## 1. Executive Status

- No cloud/infrastructure provider is currently classified GREEN.
- No entity/jurisdiction structure is currently classified GREEN.
- **Scenario 5** — a genuinely substantive foreign entity, technical
  administration performed entirely outside Iran, and the Founder retaining
  disclosed beneficial ownership but zero production access — is the most
  legally coherent structure identified across this session's research. It
  remains **THEORETICAL / UNRESOLVED**.
- European provider research has reached defensible saturation (nine
  providers with primary-or-primary-adjacent evidence, all adverse or
  unresolved-adverse; six with no signal despite repeated search attempts
  across multiple sessions).
- **PRODUCTION ELIGIBILITY = BLOCKED**, per the immutable gate in §17.
- No cloud account, billing account, payment, Terraform apply, or production
  infrastructure of any kind has been created at any point in this
  investigation (verified in §19 of this document and by every prior
  session Governance Safety Report).

---

## 2. Founder Authority

This package was prepared under an explicit Founder directive (Parsa
Kiamanesh, Founder & Owner of DECIVEXA). It supersedes no standing
governance rule in `CLAUDE.md` — in particular, it does not itself
authorize staging, committing, or pushing this file, and does not authorize
any infrastructure, billing, payment, or Terraform action. Those each
require their own separate, explicit, per-action Founder authorization, per
`CLAUDE.md`'s Standing Session Rules.

---

## 3. Current Baseline

- Repository: `parsakiamanesht-tech/DECIVEXA`, branch `main`.
- `HEAD = origin/main = 2b5157a7251f14ae5e362cb9737780be9f7bd519`, divergence `0/0` (reconfirmed in §19).
- `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md` is a pre-existing, protected,
  uncommitted local modification. It is not staged, committed, reset, or
  altered by this document or its creation.
- No GCP action, billing action, or Terraform apply has occurred at any
  point in this investigation.
- `infra/gcp` and `infra/gcp-bootstrap` remain untouched.

---

## 4. Scenario 5 Definition

The exact working hypothetical (not a current fact, not yet established):

1. A genuinely substantive foreign legal entity is established outside Iran.
2. That entity is the contracting customer of the infrastructure provider.
3. The entity has genuine corporate substance (§9), not paper substance.
4. Technical production administration is performed by personnel physically
   located outside Iran.
5. The Founder has **zero** production administrative access — no SSH keys,
   no cloud-console production access, no emergency credentials, no
   database credentials, no ability to approve production deployments,
   alter production IAM, rotate production secrets, or independently
   restore production.
6. The Founder remains the disclosed beneficial owner and retains
   strategic/business authority only.
7. All material facts — nationality, residence, beneficial ownership,
   operational-control status — are truthfully disclosed wherever legally
   or provider-required. No concealment, no nominee, no false KYC, no false
   address, no misrepresentation of any kind.
8. No sanctions circumvention, payment-route bypass, or provider-restriction
   bypass is intended by this structure.

**Classification: THEORETICAL / UNRESOLVED.** This document does not state
or imply that this structure is currently legal, currently accepted by any
provider, or currently actionable.

---

## 5. The Legal Question

> Does a genuinely non-US-person foreign entity, contracting with a
> genuinely non-US-person foreign infrastructure provider, remain exposed
> under 31 CFR Part 560 merely because its sole beneficial owner is an
> Iranian national resident in Iran — where the beneficial owner is fully
> disclosed, has no production access, does not perform technical
> administration, and technical administration is genuinely performed
> outside Iran?

Decomposed propositions (each requires independent resolution — see §6–§8
and §14 for sourcing):

| # | Proposition | Status |
|---|---|---|
| 1 | § 560.204 binds "United States persons," not foreign non-US entities directly, on its own text | [EVIDENCE, LEVEL 1] |
| 2 | § 560.204's "benefit received in Iran" extraterritorial extension is conditioned on the service being performed *by a United States person* | [EVIDENCE, LEVEL 1] |
| 3 | Whether § 560.204 or any other ITSR provision independently reaches the **foreign customer entity** itself (as opposed to the provider) merely because its beneficial owner is in Iran | [UNRESOLVED — COUNSEL REQUIRED] |
| 4 | Whether operational separation (Scenario 5's core design) changes proposition 3's answer | [UNRESOLVED — COUNSEL REQUIRED] |
| 5 | Whether a specific provider's own contractual restriction (independent of US sanctions law) would still exclude this structure | [UNRESOLVED — PROVIDER CONFIRMATION REQUIRED, and adverse-leaning per §11/§14] |

---

## 6. US Sanctions Analysis

**6.1 — 31 CFR § 560.204.** [EVIDENCE, LEVEL 1, extracted from eCFR text via
search in a prior session pass; not re-fetched this pass because `ecfr.gov`
is blocked by this environment's network egress proxy — this limitation is
recorded, not concealed, per §14's standard.] The provision prohibits
"exportation, reexportation, sale, or supply, directly or indirectly, from
the United States, or by a United States person, wherever located, of any
goods, technology, or services to Iran or the Government of Iran." Its
service-export prohibition additionally reaches services "performed on
behalf of a person in Iran or the Government of Iran or where the benefit
of such services is otherwise received in Iran, **if such services are
performed outside the United States by a United States person**, including
by an overseas branch of an entity located in the United States."

*Interpretation:* the "benefit received in Iran" extraterritorial reach is
explicitly conditioned on US-person status of whoever performs the
service. A genuinely non-US-person provider is not, on this text, brought
within § 560.204 merely because its customer's beneficial owner is in
Iran. *Counterargument counsel must address:* whether some other ITSR
provision (not yet located in this research) reaches the customer side of
the transaction rather than the provider side, and whether "facilitation"
concepts (§ 6.1 continued below) create indirect exposure through payment
processors or banking relationships with US-person status.

**6.2 — 31 CFR § 560.314 ("United States person").** [EVIDENCE, LEVEL 1,
same sourcing caveat as 6.1.] Covers: US citizens; lawful permanent
residents; entities organized under US law, including their foreign
branches; and any person physically present in the United States. A
foreign-incorporated, foreign-operated entity with no US ownership, no US
branch, and no US-person principals is **not** itself a "United States
person" under this definition.

*Applied to the Scenario 5 parties:* the hypothetical foreign entity —
foreign founder-of-record is not the question, beneficial ownership is a
separate concept from "United States person" status — would not itself be
a US person solely because its beneficial owner is Iranian. The Iranian
Founder is also not thereby a "United States person." Neither party being
a US person is necessary but **not sufficient** for eligibility (see §6.3
onward, §11, §14).

**6.3 — OFAC General Licenses.** [EVIDENCE, LEVEL 1/3 — OFAC's own GL D-2
scope confirmed via two independent legal-publication summaries (Baker
McKenzie) in prior passes, not re-verified against OFAC's primary GL text
this pass.] GL D-2 authorizes certain internet/communications-related
services, software, and hardware for personal-communications purposes.
[INTERPRETATION] It does **not** cover ordinary commercial web-hosting/
cloud infrastructure for a commercial SaaS product — DECIVEXA's actual use
case falls outside GL D-2's stated scope. A specific-license,
case-by-case pathway exists, with OFAC's own stated example being
"development and hosting of anti-surveillance software by Iranian
developers" — an internet-freedom rationale DECIVEXA's product (a
personal-productivity/life-intelligence application) does not obviously
fit.

**6.4 — Specific License.** Classification: **legally possible in
theory**; **not established as practically plausible** for this product
category; **no precedent identified** for a commercial productivity
SaaS; **counsel required** to assess whether pursuing one is worthwhile at
all.

**6.5 — OFAC 50% Rule.** [EVIDENCE, LEVEL 1/3.] The 50% Rule blocks
entities 50%+ owned, directly or indirectly, by SDN-listed persons — a
distinct, narrower mechanism from ITSR's country-based embargo. **An
ordinary Iranian national who is not personally SDN-listed is not
automatically "a blocked person" under the 50% Rule.** The operative legal
mechanism for Scenario 5 is the country-based embargo/benefit-in-Iran
concept in § 560.204 (§6.1), not the 50% Rule. This distinction is
preserved deliberately, per this directive's own instruction not to
conflate "Iranian national" with "SDN-listed person."

---

## 7. EU Analysis

[EVIDENCE, LEVEL 1, Consilium/Council of the EU sources reviewed in a prior
pass.] Current EU restrictive measures against Iran (as of the most recent
2026 designations) are **targeted** — asset freezes and travel bans against
named individuals/entities, sector-specific measures (oil-tanker services,
drone-related items, human-rights-related conduct) — not a general embargo
on ordinary commercial services to unlisted persons.

**No EU-wide provision has been identified, across any research pass, that
independently prohibits the Scenario 5 structure.** This is stated
precisely as: **"no EU-wide prohibition identified, but national law /
provider contract / counsel review required"** — not as "EU law allows
Scenario 5." Absence of an identified prohibition is not affirmative legal
approval, per this directive's own §7 instruction.

National-level rules (German, French, and other member-state
implementations) were not independently re-verified this pass beyond the
EU-wide sources already reviewed — flagged as **UNRESOLVED / COUNSEL
REQUIRED** for the specific jurisdiction any actual foreign entity would be
formed in.

---

## 8. Swiss Analysis

[EVIDENCE, LEVEL 1/3, Swiss federal sanctions-ordinance sources reviewed in
a prior pass.] Switzerland maintains its own Iran sanctions ordinance,
covering dual-use goods, defense-related items, and listed persons/entities
— targeted, not a comprehensive embargo on ordinary commercial services.
**No Swiss provision has been identified that independently prohibits the
Scenario 5 structure.** Notably, Exoscale's own Terms of Service (a Swiss
provider, confirmed by primary source in a prior pass) impose a *broader*
contractual restriction ("for the benefit of any embargoed or
comprehensively sanctioned jurisdiction") than Swiss statute itself
appears to require — reinforcing this investigation's recurring finding
that **provider contractual policy is consistently more restrictive than
the underlying law compels.**

---

## 9. Corporate Substance Requirements

A conservative checklist for what would distinguish a **genuine foreign
operating entity** from a **paper entity** whose only function is obtaining
infrastructure otherwise unavailable to its Iran-resident beneficial owner.
This is presented as a question set for counsel, not an engineering
specification — no item below is a recommendation to construct any
particular arrangement.

| Dimension | Question counsel must help answer |
|---|---|
| Registered office | Is there a real, functioning office presence, or only a registered-agent address? |
| Management | Do directors/officers actually make decisions, or merely sign what they're told to? |
| Local decision-making | Are strategic and operational decisions genuinely made where the entity is domiciled? |
| Accounting | Is bookkeeping/accounting genuinely performed there, under that jurisdiction's rules? |
| Banking | Does the entity hold and operate its own bank account, independent of the Founder's personal accounts? |
| Contracts | Does the entity enter contracts (employment, vendor, customer) in its own name and capacity? |
| Tax compliance | Does the entity file and pay taxes as a genuine resident taxpayer where formed? |
| Employees/contractors | Are the external technical operators (§10) genuinely employed/contracted by the entity, not nominally listed? |
| Business activity | Does the entity conduct real business activity beyond holding the infrastructure contract? |
| Records | Are corporate records, minutes, and resolutions genuinely maintained? |
| Board authority | Does a real board/management body exercise real authority over the entity's affairs? |
| Beneficial-owner disclosure | Is the Founder's beneficial ownership disclosed in the entity's own statutory filings, not hidden? |

**[COUNSEL REQUIRED]** on all of the above — this checklist identifies the
right questions; it does not answer them, and none of these facts is
manufactured or engineered by this document.

---

## 10. Operational Separation Model

A conservative, disclosed governance/security model for the "zero
production access" variant of Scenario 5 — presented as a design
description of the hypothetical, not as something already built or
authorized for construction.

**Founder role (strategic/beneficial owner only):**
- Disclosed beneficial owner, disclosed strategic authority.
- No production SSH keys, no cloud-console production access, no
  emergency/break-glass production access, no production database
  credentials.
- No ability to approve production deployments, alter production IAM,
  rotate production secrets, or independently restore production.

**External operator role (technical administration):**
- Physically located outside Iran.
- Independently authorized, under contract, to perform production
  administration.
- Subject to access logging, least privilege, and separation of duties.

**[EXPLICIT LIMIT, per this directive's §9 instruction]:** Operational
separation is an **evidentiary fact** that counsel or a provider's
compliance function may weigh — it is **not itself a legal safe harbor**,
and this document does not claim otherwise. Whether it changes the outcome
of §6's legal analysis, or of any specific provider's contractual
restriction, is exactly the open question in §5, proposition 4.

---

## 11. Provider Compliance Model

**Do not resume broad provider enumeration** (per this directive's own
instruction) — the following is the disclosure/confirmation *process* a
future candidate provider would need to complete, not a new provider
search.

**Required truthful disclosure to a candidate provider:**
Founder nationality; Founder residence; beneficial ownership; foreign
entity jurisdiction; corporate substance summary; technical-operator
location; Founder production-access status (none); Founder
operational-control status (none); payment structure; requested service;
intended use; any other information the provider's own KYC process
requests.

**Required provider confirmation, in writing, before any purchase:**
1. May the entity contract for this service?
2. Is the disclosed beneficial ownership acceptable?
3. Does the Founder's nationality/residence independently restrict this?
4. Does the disclosed operational separation change the provider's
   analysis?
5. Is the service permitted under the provider's current Terms?
6. Can KYC actually be completed on these facts?
7. Can payment be accepted?
8. Can the account remain active on an ongoing basis under these facts (not
   merely pass onboarding)?

**No infrastructure purchase should occur before this confirmation is
obtained**, per §16's infrastructure freeze.

The current provider evidence relevant to this model (from prior passes,
not re-run here): nine providers carry Iran/citizen-of-country/location-
of-use/beneficiary restrictions by primary or primary-adjacent source
(GCP, AWS, Azure, DigitalOcean, OVHcloud, UpCloud, Exoscale, IONOS, and —
on fuller review — Scaleway's "citizens of said countries" language, which
downgrades it from the "least adverse" status this investigation had
provisionally given it). Six providers (Hetzner, Leaseweb — adverse
secondary signal; Netcup, Contabo, Infomaniak, TransIP — no signal located)
remain UNRESOLVED. No provider has been asked the §11 questionnaire; none
has confirmed anything in writing.

---

## 12. Scenario Matrix

| Scenario | US Sanctions | EU Law | Swiss Law | Provider Contract | KYC | Beneficial Ownership | Payment/Banking | Operational Location | Legal Certainty | Classification |
|---|---|---|---|---|---|---|---|---|---|---|
| A. Founder directly contracts and operates from Iran | Binds via provider's own restriction | Not independently prohibited | Not independently prohibited | Prohibited (confirmed, every provider checked) | Fails | Iran-resident, direct | N/A | Iran | High | **RED** |
| B. Foreign company, Founder remains sole operator from Iran | Not directly binding on non-US-person entity | Not independently prohibited | Not independently prohibited | Likely prohibited (citizen/location clauses) | Likely fails | Iran-resident, direct control | Unresolved | Iran | Low | **RED-leaning, UNRESOLVED** |
| C. Foreign company, external administration, Founder retains emergency credentials | Weaker footing than D/E — retained access undercuts operational-separation argument | Not independently prohibited | Not independently prohibited | Same as D, weaker | Weaker | Iran-resident, retained access | Unresolved | Mixed | Low | **UNRESOLVED, weaker** |
| D. Foreign company, external administration, Founder zero production access | Strongest footing — § 560.204's US-person conditioning genuinely favors this | Not independently prohibited | Not independently prohibited | Plausibly still caught by citizen-of-country-style clauses (§11) | Unconfirmed | Iran-resident, no operational control | Unresolved | Outside Iran | Low-Moderate | **UNRESOLVED — this is "Scenario 5"** |
| E. Foreign company, external administration, Founder zero operational control, retains only strategic/business authority | Same footing as D | Same | Same | Same as D | Unconfirmed | Iran-resident, strategic-only | Unresolved | Outside Iran | Low-Moderate | **UNRESOLVED — functionally equivalent to D** |

No scenario reaches GREEN. None is "safe." Silence, an absence of a found
prohibition, or a less-restrictive-looking ToS clause is never treated as
GREEN anywhere in this table, per §20.

---

## 13. Evidence Register

| # | Proposition | Source | URL/Document | Date/Version | Authority Level | Independently Verified? |
|---|---|---|---|---|---|---|
| 1 | § 560.204 text and US-person conditioning | eCFR | ecfr.gov, Title 31 Part 560 Subpart B §560.204 | Current (as of prior-pass retrieval) | 1 | Search-extracted; `ecfr.gov` blocked by this session's egress proxy on later attempts — not re-opened this pass |
| 2 | § 560.314 "United States person" definition | eCFR | ecfr.gov, Title 31 Part 560 §560.314 | Current | 1 | Search-extracted, same caveat |
| 3 | GL D-2 scope (personal communications; excludes commercial hosting) | OFAC / Baker McKenzie legal summary | sanctionsnews.bakermckenzie.com | 2022 update | 1/3 | Not independently opened against OFAC's own GL text this session |
| 4 | 50% Rule mechanism | OFAC interpretive guidance (via multiple compliance-industry summaries) | Various (Kharon, Sanction Scanner, etc.) | Ongoing | 1/3 | Not independently opened against OFAC's own guidance page |
| 5 | EU Iran sanctions are targeted, not comprehensive | Council of the EU / Consilium | consilium.europa.eu | 2026 press releases | 1 | Search-extracted from official source |
| 6 | Swiss Iran sanctions ordinance scope | Swiss federal sources / legal-blog summaries | Various (Baker McKenzie sanctions blog, Lexology) | 2026 | 1/3 | Not independently opened against SECO's own ordinance text |
| 7 | GCP/AWS/Azure/DigitalOcean/OVHcloud/UpCloud/Exoscale/IONOS Iran-exclusion language | Providers' own ToS/AUP or documented enforcement actions | Various provider legal pages | Various, 2019–2026 | 1 (partially search-extracted) | Provider ToS: search-extracted, not independently opened in every case; enforcement actions (OFAC/BIS settlements): reported by multiple independent sources |
| 8 | Scaleway "citizens of said countries" clause | Scaleway General Terms of Services v17072024/07042026 | www-uploads.scaleway.com PDF | 2024/2026 | 3/4 | **SECONDARY-EXTRACTED / NOT INDEPENDENTLY VERIFIED** — `scaleway.com` and `www-uploads.scaleway.com` both blocked by this session's egress proxy on every attempt |
| 9 | Hetzner "restricted country" residency clause | Reported Special Terms PDF content | hetzner.com | Undated | 3/4 | **SECONDARY-EXTRACTED / NOT INDEPENDENTLY VERIFIED** — `hetzner.com` blocked on every attempt this session |
| 10 | Leaseweb Iran signup refusal | Independent reporting | btw.media and related coverage | Undated | 3/4 | **SECONDARY-EXTRACTED / NOT INDEPENDENTLY VERIFIED** |

No Level-4 source (forum, Reddit, anecdotal report) is represented above
Level 4 anywhere in this register.

---

## 14. Unknowns

- Whether any ITSR provision beyond § 560.204 reaches the foreign customer
  entity itself (as opposed to the provider) on the basis of its
  beneficial owner's residence.
- Whether operational separation (Scenario 5's design) would actually
  change a specific provider's own contractual analysis, given the
  "citizens of said countries"-style language found in the one provider
  (Scaleway) where fuller text was obtained.
- The actual current primary-source text of Netcup, Contabo, Infomaniak,
  and TransIP — never located despite repeated search attempts across
  multiple sessions.
- Whether any bank or payment processor would independently refuse this
  structure, and on what specific policy basis (distinct from the legal
  question).
- Whether a genuinely substantive foreign entity, built to the §9
  checklist, would in fact be recognized as such by counsel or a provider
  — no such entity currently exists to evaluate.

---

## 15. Counsel Brief

**Facts.** DECIVEXA is a commercial SaaS/software business. Its Founder,
Parsa Kiamanesh, is an Iranian national physically resident in Iran and
sole beneficial owner. A genuinely substantive foreign entity is under
consideration (not yet formed), with technical administration to be
performed by personnel physically outside Iran and, in the strongest
variant, zero production administrative access retained by the Founder.
No concealment of any kind is contemplated — all material facts would be
truthfully disclosed to any provider, bank, or authority requiring them.

**Legal questions for counsel:**
1. Does 31 CFR § 560.204 (or any other ITSR provision) reach a genuinely
   non-US-person foreign entity contracting with a genuinely non-US-person
   foreign provider, given the Iran-resident beneficial owner?
2. Does the answer change materially between the "Founder retains
   operational control" scenarios (B/C) and the "Founder has zero
   production access" scenarios (D/E)?
3. What corporate substance (per the §9 checklist) is actually required
   for the foreign entity to be legally genuine rather than a formality?
4. Do EU or Swiss sanctions independently restrict this fact pattern,
   beyond what has been identified as targeted/non-comprehensive?
5. Is any OFAC general or specific license realistically relevant?
6. What, if anything, must be disclosed to a prospective provider or bank
   as a matter of law, independent of what that provider's own KYC asks?

**Documents to provide counsel:** this package in full, plus the six prior
session investigation reports (available in this conversation's history)
if a complete evidentiary trail is wanted.

---

## 16. Provider Questionnaire

The exact, truthful disclosure and question set from §11, ready to send to
a specific candidate provider's compliance function **once** counsel has
weighed in on §15 and an actual candidate entity exists. **Not sent by this
document or this investigation.**

---

## 17. Decision Gate

**PRODUCTION ELIGIBILITY = BLOCKED.**

It may change only if **both** conditions are satisfied:

**Condition A — Legal.** Qualified counsel provides a documented assessment
that the exact disclosed Scenario 5 facts are lawful, or otherwise legally
permissible, under all applicable regimes (US, EU, Swiss, or whichever
jurisdiction is actually relevant to the entity formed and the provider
chosen).

**Condition B — Provider.** A specific provider's compliance/KYC function
confirms, in writing, that the exact disclosed ownership, nationality,
residence, operational-control, and usage facts are acceptable under its
current policies and Terms.

If either condition is missing: **PRODUCTION = BLOCKED.**

Explicitly, none of the following constitutes approval on their own:
silence; an absence of a prohibition found by search; a less-restrictive-
looking Terms of Service; foreign incorporation of the contracting entity;
operational separation alone; or non-US ownership of the provider.

---

## 18. Infrastructure Freeze

Until both Condition A and Condition B in §17 are satisfied, the following
remain forbidden without a separate, explicit, per-action Founder
authorization: creating a cloud account; activating billing; purchasing a
VPS or dedicated server; creating a production database; deploying
production infrastructure; applying Terraform; transferring production
secrets; migrating production data; committing credentials; modifying
production infrastructure. `infra/gcp` and `infra/gcp-bootstrap` remain
untouched. Local/dev development continues unaffected — see §20.

---

## 19. Governance Rules

- Branch: `main`.
- `HEAD = origin/main`, reconfirmed at the end of this task (see the
  session's final Governance Safety Report accompanying this document's
  creation).
- Protected modification `docs/DECIVEXA/GOVERNANCE_RECONCILIATION.md`
  remains untouched — not staged, not committed, not reset, not rewritten.
- This document itself is created as a new, untracked file only. It is
  **not** staged, committed, or pushed by this task — that requires a
  separate, explicit Founder authorization per `CLAUDE.md`'s Standing
  Session Rules, which this directive does not itself grant.
- No cloud account, billing account, payment, Terraform apply, or
  production infrastructure action has occurred at any point in this
  investigation.

---

## 20. Next Authorized Action

**Default next action:** engage qualified US sanctions/export-control
counsel using this completed package (§15 in particular). A broad European
provider search is **not** the next priority absent new authoritative
evidence creating a specific reason to reopen that track (per this
directive's own §23.H instruction).

DECIVEXA's application development continues, entirely decoupled from this
question: local/dev PostgreSQL, Docker, NestJS, Next.js, Memory, Personal
Intelligence, the AI Gateway, and the provider-independent `AIProvider`
abstraction are all unaffected and unmodified by this investigation or by
this document's creation.
