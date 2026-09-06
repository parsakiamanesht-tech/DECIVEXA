# DECIVEXA — PIP-002 Production Foundation Master Plan

**Document ID:** PIP-002  
**Version:** 1.0  
**Status:** FOUNDER-APPROVED — ARCHITECTURALLY REGISTERED — EXECUTION NOT AUTHORIZED  
**Date:** 2026-09-06  
**Founder:** Parsa Kiamanesh  
**Target:** Initial Production Launch  
**Selected infrastructure:** Hetzner Cloud CX53, Germany  

---

## 1. Purpose

This document defines the approved Production Foundation architecture and operational design for the initial DECIVEXA Production launch.

It is a design and governance record. It does **not** authorize provisioning, deployment, migration, DNS cutover, secret creation, production data mutation, or any other implementation activity.

The objective is to establish a production foundation that is:

- secure by default;
- reproducible;
- observable;
- recoverable;
- auditable;
- minimally complex for the current stage;
- capable of later separation and scaling;
- independent of any single infrastructure vendor at the application-architecture level;
- consistent with DECIVEXA Founder governance.

---

## 2. Current Infrastructure Decision

### 2.1 Primary initial Production

**Hetzner Cloud CX53 — Germany** is selected as the initial Production launch server.

Current known plan characteristics:

- 16 vCPU;
- 32 GB RAM;
- 320 GB local NVMe storage;
- EU traffic allowance appropriate to the selected plan;
- Shared CPU resources.

The CX53 is an **Initial Production Launch Server**, not a permanent architectural ceiling or lifetime infrastructure commitment.

### 2.2 Important capacity constraint

CPU resources are shared. Production capacity is therefore **not guaranteed by nominal vCPU count** and must be established through actual runtime and load verification.

The previously discussed figures of approximately 100–200 simultaneous users and 50–100 concurrent requests are planning assumptions only, not capacity guarantees.

### 2.3 Future scaling path

The architecture must permit later separation of:

- Web;
- API;
- PostgreSQL;
- workers/background processing;
- supporting infrastructure;
- observability;
- object/file storage;

without requiring a product/domain redesign solely because the initial deployment used one server.

---

## 3. Launch Topology

Initial topology:

```text
Internet
   |
   v
HTTPS / Reverse Proxy
   |
   +-------------------+
   |                   |
   v                   v
Next.js Web         NestJS API
                       |
                       v
                  PostgreSQL
```

All initial services may run on the CX53, but service boundaries must remain explicit.

PostgreSQL must not be publicly exposed.

---

## 4. Application Deployment Boundaries

The initial deployment consists conceptually of:

- `web` — Next.js production runtime;
- `api` — NestJS production runtime;
- `postgres` — PostgreSQL persistent database;
- `reverse-proxy` — public HTTP/HTTPS entry point.

Additional services such as Redis, queues, workers, object storage, search, or other infrastructure must not be introduced merely for convenience or perceived completeness. Each requires an actual approved requirement.

---

## 5. Docker Policy

Docker is the initial reproducible deployment mechanism, not an architectural identity for DECIVEXA.

Production containers should use:

- pinned/controlled base images;
- production builds rather than development servers;
- explicit startup commands;
- health checks where appropriate;
- controlled restart behavior;
- minimal privileges;
- non-root execution where technically feasible;
- no host filesystem access unless explicitly required;
- no privileged containers unless explicitly justified;
- no Docker socket exposure to application containers.

Production image construction must avoid unnecessary development tooling in the runtime image.

---

## 6. PostgreSQL Architecture

PostgreSQL is a stateful production dependency and must be treated separately from stateless application containers.

Requirements:

- persistent storage;
- controlled PostgreSQL version;
- controlled credentials;
- private network exposure;
- migration integrity;
- connection management;
- database health checks;
- disk monitoring;
- backup strategy;
- restore procedure;
- recovery verification.

The database must never be considered safe merely because its container is running.

### 6.1 PostgreSQL operational concerns

Before Production acceptance, the actual deployment must establish and verify appropriate behavior for:

- connection limits/pooling;
- autovacuum defaults/behavior;
- WAL behavior;
- disk growth;
- transaction failure handling;
- graceful shutdown;
- database restart recovery;
- backup consistency.

No arbitrary tuning values should be introduced without evidence from the actual workload or a justified operational requirement.

---

## 7. Database Migration Policy

DECIVEXA uses Drizzle ORM and has a history of snapshot/migration integrity concerns. Therefore database migration integrity is a critical Production gate.

Required verification layers:

1. migration files are internally coherent;
2. Drizzle snapshots/metadata are coherent;
3. a clean database can reach the expected schema through the migration chain;
4. the expected schema is compatible with the application candidate;
5. any existing production database state is known before mutation;
6. migrations are executed only through a controlled process.

Manual production schema edits are prohibited except through a separately approved emergency procedure.

---

## 8. Backup and Recovery Architecture

Hetzner server backups/snapshots are useful infrastructure protection but are not the sole DECIVEXA recovery strategy.

The design requires two conceptual layers:

```text
Production PostgreSQL
       |
       +---- Server-level protection
       |
       +---- Independent database backup
                    |
                    v
              Off-server copy
```

Requirements:

- automated backup schedule;
- explicit retention policy;
- encrypted backups where applicable;
- off-server copy;
- backup integrity verification;
- documented restore procedure;
- actual restore test;
- evidence of restore success.

**Backup success is not recovery success.**

The exact RPO, RTO, retention duration, and external backup destination remain operational decisions to be finalized before the corresponding execution gate. They are not silently assumed by this document.

---

## 9. Disaster Recovery

The Production foundation must have documented recovery paths for at least:

- application container failure;
- failed deployment;
- PostgreSQL failure;
- database corruption;
- disk exhaustion;
- complete server loss;
- credential compromise;
- DNS/TLS failure;
- backup failure.

Complete server loss must have a credible recovery path:

```text
Replacement server
    -> OS/security baseline
    -> deployment foundation
    -> application
    -> secrets
    -> database restore
    -> DNS/TLS
    -> runtime verification
```

Backup availability without a tested recovery procedure does not constitute disaster readiness.

---

## 10. RPO / RTO

RPO and RTO must be explicitly selected before Production acceptance.

This document does not invent those values.

The eventual operational record must state:

- target RPO;
- target RTO;
- measurement method;
- recovery procedure;
- actual observed recovery result.

---

## 11. Network Security

Public exposure must be minimized.

Conceptual exposure:

| Port | Purpose | Exposure |
|---|---|---|
| 80 | HTTP / redirect or certificate support | Public if required |
| 443 | HTTPS | Public |
| 22 | SSH administration | Restricted |
| 5432 | PostgreSQL | Private only |

Exact implementation must be verified on the actual server.

Any additional public port requires explicit justification.

---

## 12. SSH Security

Required baseline:

- key-based authentication;
- password authentication disabled;
- root password login disabled;
- only required administrative accounts;
- least privilege;
- controlled key ownership;
- documented recovery access.

SSH configuration changes must preserve a known recovery path and must not lock out legitimate administration.

---

## 13. Firewall

A host/cloud firewall must restrict inbound traffic to the minimum required set.

The firewall policy must be recorded as evidence before Production acceptance.

A firewall configuration that exists only in an operator's memory is not sufficient.

---

## 14. TLS / HTTPS

Production public traffic must use HTTPS.

Requirements:

- valid certificate;
- automated/controlled renewal;
- HTTP behavior explicitly defined;
- no accidental plaintext application exposure;
- certificate renewal path verified.

DNS cutover must occur only after the server and application have passed internal verification.

---

## 15. DNS

The final Production domains are to be confirmed before cutover.

Conceptually the deployment may use:

```text
primary web domain
www domain if required
API subdomain if required
```

No domain naming assumption in this document constitutes a Founder decision about the final public domain structure.

DNS changes are a late-stage controlled action.

---

## 16. Secrets Management

Production secrets must not be committed to Git.

Secrets include, where applicable:

- database credentials;
- authentication secrets;
- API keys;
- AI/provider credentials;
- encryption keys;
- cloud credentials;
- other privileged credentials.

Required properties:

- production-specific;
- not embedded in source;
- not embedded in Docker images;
- not printed in logs;
- not included in acceptance reports;
- rotatable where feasible.

Acceptance reports may record `PRESENT`, `MISSING`, or `REDACTED`, but never reveal secret values.

---

## 17. Environment Separation

At minimum, DECIVEXA must distinguish:

- development;
- CI/test;
- Production.

Production credentials and sensitive data must not be reused in development/test environments.

Next.js public/client-visible variables must be explicitly distinguished from server-only secrets.

---

## 18. Application Runtime

### Web

Next.js must run using a production build and production runtime process.

### API

NestJS must run from its production build and support graceful shutdown.

### API/DB

The API must connect to PostgreSQL through the intended production configuration without exposing the database publicly.

---

## 19. Health and Readiness

The deployment should distinguish:

- liveness;
- readiness;
- dependency health.

At minimum, the system must provide an operationally meaningful way to determine whether the API is alive and whether it is ready to serve requests.

If the current application lacks a required health surface, that is a finding to be evaluated during preflight. PIP-002 does not itself authorize implementation of new application features.

---

## 20. Graceful Shutdown

Application services must support controlled termination where technically feasible:

```text
SIGTERM
  -> stop accepting new work
  -> finish in-flight work where appropriate
  -> close database connections
  -> exit cleanly
```

This is important for deployment, restart, and future horizontal scaling.

---

## 21. Logging

Logs must be useful for operations while minimizing sensitive information.

Must not log:

- passwords;
- access tokens;
- API keys;
- database credentials;
- private keys;
- unnecessary sensitive personal data.

Log rotation/retention must prevent logs from consuming the entire server disk.

---

## 22. Monitoring

Minimum operational observability should cover:

### Server

- CPU;
- RAM;
- disk capacity;
- disk I/O where available;
- network;
- system health.

### Containers

- running state;
- health state;
- repeated restarts;
- resource behavior.

### Application

- availability;
- error rate;
- latency;
- relevant request metrics.

### Database

- availability;
- connection pressure;
- disk usage;
- errors;
- backup status.

Monitoring and alerting providers are not fixed by this architecture record and must be selected based on actual operational needs.

---

## 23. Alerting

At minimum, critical operational alerts should cover:

- application unavailable;
- API unavailable;
- PostgreSQL unavailable;
- repeated container crashes;
- critical disk utilization;
- backup failure;
- TLS/certificate problem;
- material infrastructure failure.

Exact thresholds must be calibrated to the real deployment rather than invented without evidence.

---

## 24. CI/CD

CI may be automated.

Initial Production deployment should remain controlled/approval-based rather than becoming automatically authorized merely because CI is green.

Conceptual path:

```text
Commit
  -> CI
  -> approved candidate
  -> controlled deployment
  -> health checks
  -> smoke tests
  -> acceptance / rollback
```

Production deployment automation must never bypass Founder-controlled gates.

---

## 25. Artifact and Supply-Chain Integrity

Before Production acceptance, the deployment process must establish what artifact/version is actually running.

At minimum:

- commit SHA known;
- application version known;
- image/build provenance known where applicable;
- lockfile state known;
- dependency installation reproducible;
- no unexpected build-time mutation.

Container/image signing or advanced supply-chain tooling may be added later if justified; this document does not mandate unnecessary tooling.

---

## 26. Rollback

Application rollback and database recovery are separate mechanisms.

Application rollback:

```text
Version N
  -> failed deployment
  -> Version N-1
```

Database recovery:

```text
Known backup
  -> restore/recovery procedure
  -> schema/data verification
```

A deployment is not operationally complete until the rollback path is understood and, where feasible, tested.

---

## 27. Performance and Capacity

Capacity is to be established empirically.

Baseline/load verification should observe:

- throughput;
- p50 latency;
- p95 latency;
- p99 latency where meaningful;
- error rate;
- CPU;
- memory;
- database connections;
- disk behavior;
- network behavior.

The test sequence may progressively increase concurrency, but exact load levels and acceptance thresholds must be defined from actual product requirements before a final capacity claim is made.

**No numerical capacity guarantee is granted by this document.**

---

## 28. High Availability

The initial architecture is intentionally **not High Availability**.

Single-server topology is accepted as a launch-stage operational tradeoff only if recovery controls are sufficient for the Founder-approved risk tolerance.

This document does not authorize an HA cluster, multi-region topology, managed database migration, or other complexity increase.

---

## 29. Future Scale Path

Potential evolution:

```text
Stage 1
CX53: Web + API + DB

Stage 2
Web / API / DB separated

Stage 3
Multiple Web/API instances + load balancing + dedicated DB/worker resources

Stage 4
Managed/dedicated infrastructure, workers, object storage, queueing, advanced observability as justified
```

A transition must be triggered by evidence, not by prestige or premature optimization.

---

## 30. AI / Intelligence Boundary

Production infrastructure work must not be used as an excuse to modify or complete DECIVEXA's AI architecture.

In particular, this plan does not authorize:

- AI Runtime activation;
- provider selection;
- provider integration;
- capability registration;
- Model Router implementation;
- Context Engine redesign;
- memory schema changes;
- Evidence/Claim schema changes;
- agent implementation;
- AI feature implementation.

Existing AI architecture records and ADR-009 remain authoritative within their scopes.

---

## 31. Product and Domain Freeze

Production work must not introduce product/domain changes merely to make deployment easier.

The following are outside this plan unless separately authorized:

- new product features;
- domain model changes;
- Observation/Event implementation;
- Goal OS redesign;
- FIS implementation;
- major UX changes;
- schema redesign.

---

## 32. Disaster / Incident Operations

A minimal operational incident path must exist:

```text
Detect
  -> Contain
  -> Preserve evidence
  -> Recover
  -> Verify
  -> Document
  -> Review
```

Emergency action is not a blanket authorization to redesign DECIVEXA.

---

## 33. Data Protection Principles

Production infrastructure must preserve DECIVEXA's established security principles, including:

- Privacy by Design;
- data ownership;
- least privilege;
- selective encryption where applicable;
- export/delete requirements where applicable;
- no unnecessary data exposure in logs or backups.

Infrastructure implementation must not weaken existing privacy/security architecture for convenience.

---

## 34. Operational Unknowns That Must Be Resolved Before Final Acceptance

The following are intentionally not guessed:

- exact Production domain(s);
- exact RPO;
- exact RTO;
- backup retention period;
- independent backup destination/provider;
- monitoring/alerting provider;
- final SSH access policy;
- final DNS provider configuration;
- final resource thresholds;
- final load-test acceptance thresholds;
- whether additional external services are actually required.

These become explicit decisions or evidence-backed operational values before their respective gates.

---

## 35. Production Acceptance Principles

Production Ready requires more than a successful deployment.

The final acceptance must separately establish:

- infrastructure availability;
- security baseline;
- application runtime;
- database integrity;
- backup success;
- restore success;
- rollback readiness;
- external runtime verification;
- operational observability;
- acceptable performance;
- disaster recovery readiness;
- Founder approval.

---

## 36. Official Gate Sequence

```text
G0  Founder Authorization
G1  Infrastructure Provisioned
G2  Server Security
G3  Deployment Foundation
G4  Database Integrity
G5  Application Deployment
G6  Runtime Connectivity
G7  HTTPS / DNS
G8  Backup
G9  Restore
G10 Rollback
G11 Security Verification
G12 Performance Baseline
G13 Disaster Recovery
G14 External Runtime Acceptance
G15 Founder Production Acceptance
```

No gate implicitly authorizes the next gate.

---

## 37. Evidence Status Vocabulary

Only these statuses are permitted:

- **PASS** — tested and evidence supports the claim;
- **FAIL** — tested and condition is not satisfied;
- **BLOCKED** — test cannot be performed because a required dependency/condition is unavailable;
- **NOT TESTED** — test has not yet been performed.

`BLOCKED` is never equivalent to `PASS`.

---

## 38. Core Governance Invariant

> **Production infrastructure exists to run the approved DECIVEXA system safely; it must not silently redefine what DECIVEXA is.**

---

## 39. Implementation Authorization

This document does **not** authorize implementation.

Implementation begins only through a separate Founder-approved execution gate and the applicable Claude Code execution protocol.

**Implementation Authorization: NOT GRANTED by PIP-002.**
