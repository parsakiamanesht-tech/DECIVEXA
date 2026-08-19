# TD-04 — Security Threat Model

**Status:** Proposed technical contract

## Objective

Turn FIS-058 into explicit security controls for sensitive personal and derived intelligence.

## Asset classes

DECIVEXA MUST classify data at minimum as Public, Personal, Sensitive, Highly Sensitive and Critical Personal Intelligence. Derived intelligence inherits or escalates sensitivity when its content warrants it.

Critical assets include Personal Constitution, Personal Digital Twin, sensitive personal models, predictions, decision patterns and high-impact derived intelligence.

## Trust boundaries

At minimum distinguish:

- device/client;
- DECIVEXA API boundary;
- domain services;
- Personal Intelligence / Memory services;
- AI Gateway;
- external AI providers;
- third-party integrations;
- background workers/agents;
- observability/audit systems;
- administrative/operator access.

## Threats

The threat model MUST cover unauthorized access, privilege escalation, token/session compromise, malicious integrations, agent abuse, memory poisoning, prompt injection, data exfiltration, insecure secrets, provider leakage, correlation attacks, insider misuse, replay, synchronization attacks and breach propagation.

## Mandatory controls

- deny-by-default authorization;
- least privilege;
- server-side authorization enforcement;
- strong authentication and session protection;
- encryption in transit and at rest;
- managed secrets and key lifecycle;
- purpose-limited integration permissions;
- AI privacy gateway;
- isolated service credentials;
- sensitive-data minimization;
- security audit trail without sensitive payload leakage;
- rate limiting and abuse controls;
- compartmentalized storage/access;
- secure deletion/export controls;
- incident response and breach containment.

Custom cryptography is prohibited. Established, maintained cryptographic primitives and libraries MUST be used.

## Audit

Security-sensitive access MUST record actor/service, resource class, action, purpose/context where available, timestamp and outcome. Audit records MUST avoid copying sensitive payloads unnecessarily.

## Acceptance criteria

- Every Critical Personal Intelligence asset has threats and mandatory controls.
- Cross-domain and external access is authorized centrally.
- A breach of one component does not imply unrestricted Personal Twin access.
- Secrets and keys have an explicit lifecycle.
- Security controls are testable before release.
