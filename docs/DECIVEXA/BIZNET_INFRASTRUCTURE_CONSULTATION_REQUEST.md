# DECIVEXA — BIZNET INFRASTRUCTURE CONSULTATION REQUEST

**Document type:** External technical consultation request, drafted for
review before being sent to Biznet. Not yet sent.
**Status:** FOUNDER-REVIEWED — DRAFT, NOT YET TRANSMITTED. Sending this
request externally requires a separate, explicit Founder decision.
**Date:** 2026-09-01.
**Companion document:** `docs/DECIVEXA/CURRENT_ARCHITECTURE_AND_INFRASTRUCTURE_REQUIREMENTS_AUDIT.md`,
whose evidence this request is drawn from.

**Note for internal reviewers before sending:** this text is written to be
sent to Biznet as-is. It intentionally does not prescribe a specific
Biznet product, does not exaggerate current production scale, and does
not invent CPU/RAM numbers not supported by repository evidence — those
are requested *from* Biznet, not asserted here.

---

## Draft Request Text

Hello,

We are evaluating infrastructure providers for DECIVEXA, a TypeScript
monorepo application currently in active development, and would like
your guidance on the most appropriate Biznet infrastructure architecture
and service/package configuration for our workload.

### About DECIVEXA

DECIVEXA consists of three applications:

1. A Next.js web front end — **public-facing**.
2. A NestJS API back end — **public-facing**, backed by PostgreSQL.
3. A separate, **internal-only** AI Gateway service that mediates all
   outbound calls to a third-party AI provider (OpenAI), so that no other
   part of the system ever contacts the AI provider directly. This
   service must **not** be publicly accessible.

### Current Implementation State

The web and API applications are implemented and tested, including
authentication and a data-editing feature. Several additional backend
domains exist at the data-model/business-logic level but are not yet
exposed over HTTP. The AI Gateway's HTTP contract and OpenAI integration
are implemented and containerized (Docker); its production-grade
service-to-service authentication layer is still being finalized.

### Technical Workload

- Three small-to-modest Node.js services (one of which, the AI Gateway,
  should remain reachable only from our API service, never from the
  public internet).
- One PostgreSQL database, with PostgreSQL 18 as the version currently
  verified in CI.
- Currently low, not-yet-measured production traffic — we do not yet
  have production load data to share, and would rather receive a
  recommendation based on the workload described here than overstate our
  current scale.

### Key Architectural Requirements

1. The web application is public.
2. The API application is public.
3. The AI Gateway must **not** be publicly accessible under any
   configuration.
4. The API → AI Gateway connection must use a private network path or
   another strongly protected service-to-service boundary — not a
   public-internet call secured only by a shared secret.
5. The AI Gateway → OpenAI connection requires reliable outbound HTTPS.
6. PostgreSQL must not be publicly exposed to the internet.
7. We do not store secrets/credentials in source control, and need a
   secure way to store and access them at runtime instead.
8. Our current traffic is low and not yet precisely measured.
9. We need a realistic path to scale up as usage grows, without being
   forced into a full re-architecture to do so.

### Infrastructure Requirements

**PostgreSQL:** we need PostgreSQL 18 (or a compatible version you
support), reachable privately from our API service only.

**Containers:** our services are built as Docker images. We'd like to
understand what container-hosting options you offer — a managed container
platform, a VPS with Docker support, Kubernetes, or another model.

**Networking/security:** we need to expose our web and API services
publicly over HTTPS, while keeping our AI Gateway reachable only from our
own API service (private networking or firewall rules), and to restrict
that Gateway's own outbound internet access to a small, explicit
allowlist of destinations (OpenAI's API endpoints).

**Secrets:** we need a secure way to store at least one API credential (an
OpenAI API key), readable only by the specific service that needs it.

**Backup/recovery:** we do not yet have a defined backup policy and would
appreciate your guidance on available database backup/snapshot options,
retention periods, restore procedures, and any RPO/RTO guarantees you can
offer.

**Deployment:** we deploy from GitHub via CI/CD and would like our
production deployments to require a human approval step before going
live. Please let us know what deployment/CI integration options you
support.

**Scaling:** our current traffic is low, but we'd like to understand your
resource-upgrade path (vertical and/or horizontal) as usage grows.

### Our Request

Based on these technical requirements and workload characteristics,
please recommend the most appropriate Biznet infrastructure architecture
and service/package configuration for DECIVEXA.

Specifically, could you please advise on:

- Your recommended service tier/product for this workload (VPS, dedicated
  server, managed container platform, or other), and the reasoning behind
  the recommendation.
- CPU, RAM, and storage configuration you'd suggest as a starting point.
- Storage type and expected performance characteristics.
- PostgreSQL 18 availability — as a managed service, or self-managed on
  your infrastructure.
- Docker/container support details.
- Private networking options between services.
- Firewall capabilities.
- Public and private IP options, including IPv4/IPv6 availability.
- Bandwidth/traffic allowances and any limits.
- Outbound HTTPS connectivity — specifically, reliable connectivity to
  OpenAI's API.
- Static/dedicated egress IP availability, if relevant to your network
  design.
- DDoS protection options.
- Backup and snapshot services — availability, retention, and cost.
- Restore procedures and any RPO/RTO figures you can share.
- TLS/reverse-proxy support.
- DNS management options.
- Monitoring and logging capabilities.
- Availability, redundancy, and any SLA you offer.
- Support level included, and available upgrades.
- Your resource upgrade/downgrade process as our needs grow.
- Any migration assistance you can offer if we move to your platform.
- Relevant alternative configurations we should consider.
- Pricing for your recommended configuration — both monthly and annual,
  if these differ.

We are evaluating infrastructure options based on our actual technical
requirements rather than a predetermined product, so please feel free to
recommend whatever combination of your services best fits the workload
described above.

Thank you for your time — we look forward to your recommendation.

Best regards,
Parsa Kiamanesh
DECIVEXA

---

## Internal Notes (not part of the text to send)

- This request intentionally omits exact CPU/RAM figures, production
  traffic numbers, and any specific compute sizing — none of these are
  supported by current repository evidence, and inventing them here would
  violate this session's evidence discipline. Biznet is asked to propose
  a starting configuration instead.
- Sending this request externally, and any subsequent architecture change
  based on Biznet's response, requires a separate, explicit Founder
  decision. This document does not authorize transmission.
