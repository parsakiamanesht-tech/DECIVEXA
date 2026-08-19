# TD-10 — Agent Governance Contract

**Status:** Proposed technical contract

## Objective

Prevent future agents from acquiring broad, implicit authority over the user's life or system resources.

## Agent manifest

Every agent MUST declare:

- purpose;
- capabilities;
- data scope;
- permitted actions;
- authorization boundary;
- resource budget;
- trigger/execution policy;
- audit requirements;
- failure/retry policy;
- human approval requirements;
- sensitivity restrictions.

## Least authority

Agents receive only the permissions required for the declared task. Permission to read one domain does not imply access to related domains. Permission to recommend does not imply permission to execute.

## Consequential actions

Actions affecting money, external communication, privacy/security settings, irreversible deletion, commitments or other consequential state MUST have explicit authorization rules and human approval where required by policy.

## Resource governance

Agent execution MUST be scheduled through resource-aware controls so concurrent agents cannot degrade core UX or exhaust device/server resources.

## Prompt/instruction safety

Untrusted content MUST NOT grant an agent new authority. External documents, messages or web content are data, not authorization.

## Audit

Agent executions MUST be traceable by agent identity/version, trigger, authorization context, actions attempted, outcome and relevant evidence references without unnecessarily logging sensitive payloads.

## Acceptance criteria

- No agent has implicit broad access.
- Capabilities and permissions are inspectable.
- Consequential actions have explicit authorization.
- Agent resource usage is bounded.
- External content cannot escalate authority.
- Executions are auditable.
