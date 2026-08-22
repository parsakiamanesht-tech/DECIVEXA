# Claude Project Understanding Audit

## Purpose

This document is a read-only onboarding and comprehension test for an AI engineering agent before it is allowed to modify DECIVEXA.

## Operating Mode

**READ / PLAN / AUDIT ONLY.**

No source files, configuration files, migrations, schemas, CI workflows, dependencies, documentation, or architecture documents may be modified as part of this audit.

No branch changes, commits, pushes, PRs, migrations, database writes, or destructive commands are permitted.

## Required Reading

Start with `12_SOURCE_OF_TRUTH_INDEX.md`, then read the relevant documents listed there, including the Constitution, Architecture, Product Vision, Module Map, Architectural Decisions, Current State, Recovery Baseline, Backlog, Development Rules, Evidence Protocol, Handoff, Knowledge Register, Knowledge Base/Future Memory, Completeness Audit, and Historical Register.

Then inspect the actual repository tree and relevant implementation/configuration files. Do not treat documentation as proof that a capability is implemented.

## Required Report

Produce a single evidence-based report with these sections:

### 1. DECIVEXA Identity

Explain in your own words:

- What DECIVEXA is.
- What Decision OS means in relation to DECIVEXA.
- What DECIVEXA is explicitly NOT.
- The core problem it is intended to solve.

### 2. Long-Term Destination

Explain what DECIVEXA is intended to become, including the role of:

- Human Understanding System
- Personal Intelligence Core
- Memory
- Decision AI
- Personal AI Coach
- Research Assistant
- PDM
- Growth Navigation Engine
- Progress Intelligence
- Learning Intelligence
- Risk Intelligence
- Agents
- Voice
- Predictive Recommendations
- Digital Twin

Separate implemented capabilities from planned/deferred capabilities.

### 3. Product Architecture

Explain the OS/module model and the boundaries between major modules, especially Goal OS versus Daily OS.

Explain Goal Discovery, Goal Readiness, Goal Ecology, Goal Contract, and Goal Activation.

### 4. Philosophy and Non-Negotiables

List and explain the principles that must not be casually violated, including Evidence Before Opinion, Human Agency, Privacy by Design, Architecture Before Accumulation, Development Freeze, Founder Governance, and independent verification.

### 5. Current Reality

Describe what is actually true in the repository today.

For every important claim classify it as one of:

- IMPLEMENTED
- STATIC VERIFIED
- RUNTIME VERIFIED
- PLANNED
- BACKLOG
- HISTORICAL
- UNKNOWN

Never infer implementation merely from documentation.

### 6. Recovery State

Explain L2.1, the recovery baseline, the recovery anchor, the recovery snapshot, and the runtime limitations.

### 7. Drizzle Investigation

Reconstruct the known evidence around the malformed snapshots.

Explicitly distinguish:

**PROVEN:** snapshots are malformed according to the observed validation path.

**NOT PROVEN:** the exact field/structural/value cause of the malformed data.

Do not invent a root cause.

### 8. Historical Context

Explain which important decisions are historical, superseded, deferred, experimental, rejected, or recovery artifacts.

Explain why historical context must not silently override current implementation truth.

### 9. Architecture Risks

Identify contradictions, ambiguities, missing evidence, or areas where documentation and code may diverge.

Do not fix them. Report them.

### 10. Recommended Next Step

Recommend the safest next engineering step based only on the evidence you inspected.

Do not implement it.

## Mandatory Evidence Discipline

For every material claim, identify its source:

- repository code/configuration
- documentation
- git history
- CI evidence
- runtime evidence
- historical record
- inference

If evidence is insufficient, say **UNKNOWN / NOT PROVEN**.

## Success Criteria

The audit succeeds only if the report demonstrates that the agent can distinguish:

1. What DECIVEXA is today.
2. What DECIVEXA is intended to become.
3. What is currently implemented.
4. What is verified.
5. What is planned or deferred.
6. What is historical.
7. What is merely inferred.
8. What remains unknown.

## Hard Stop

After producing the report, stop.

Do not modify the repository.

Do not create a PR.

Do not run migrations.

Do not change dependencies.

Do not attempt to repair Drizzle.

Do not propose a code patch as if it were already approved.

Wait for explicit founder approval before entering implementation mode.
