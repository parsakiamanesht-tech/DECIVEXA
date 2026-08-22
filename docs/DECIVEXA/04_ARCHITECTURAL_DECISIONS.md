# DECIVEXA Architectural Decisions

This document records durable decisions and the reasoning behind them. New material decisions must be appended rather than silently rewritten.

## ADR-001 — Product Brand

**Decision:** Use **DECIVEXA** as the product brand while retaining **Decision OS** as the architecture/philosophy name.

**Reason:** Preserve the conceptual architecture while establishing a distinct product identity.

**Constraint:** Large technical renames are deferred until an Architecture Freeze / approved rename window.

## ADR-002 — Backend Direction

**Decision:** NestJS is the current backend direction.

**Historical note:** Express was an earlier direction and should not be treated as the current target.

## ADR-003 — Web Direction

**Decision:** Next.js is the current web frontend direction.

**Historical note:** React/Vite was an earlier direction.

## ADR-004 — Mobile Timing

**Decision:** Flutter mobile is a later phase after the web/core foundation is stable.

## ADR-005 — Goal OS Boundary

**Decision:** Goal OS owns goal discovery, creation, validation, readiness, ecology, contract, and activation. Daily execution belongs to Daily OS.

**Reason:** Prevent Goal OS from becoming a task-execution module and preserve clean architecture.

## ADR-006 — Evidence Before Opinion

**Decision:** Architecture and debugging claims must distinguish proven evidence from inference.

**Example:** A malformed Drizzle snapshot error proves that the snapshot is malformed to the parser; it does not by itself prove which exact field caused the malformed state.

## ADR-007 — Architecture Backlog

**Decision:** Deferred architectural ideas are recorded in an Architecture Backlog rather than discarded or implemented opportunistically.

**Reason:** Preserve strategic ideas while protecting development freeze and scope discipline.

## ADR-008 — Recovery Baseline

**Decision:** Recovery baselines and anchors are first-class artifacts.

**Current known baseline:** L2.1 recovery baseline, externally preserved and anchored in Git history. Latest recorded Recovery Anchor: `5133626acff35aa8aaaf3c72614f40bc79ce679b`.

## ADR-009 — Runtime Verification Boundary

**Decision:** Static verification is not runtime verification.

**Known constraint:** The prior sandbox environment could not install npm dependencies because registry egress was blocked and did not provide a PostgreSQL/container runtime. Therefore runtime-sensitive claims must be verified in an external capable environment before advancing lifecycle state.

## ADR-010 — Implementation Agent Model

**Decision:** Claude Code can serve as the primary implementation agent when connected directly to the GitHub repository; GitHub Actions provides independent verification; Termux remains a runtime/recovery fallback; architecture review remains independent.

**Reason:** Reduce manual file transfer and preserve a single repository source of truth.

## ADR-011 — Founder Governance

**Decision:** Material architectural, security, philosophy, and product-direction changes require founder approval.

## ADR-012 — Trustworthy Navigation Architecture

**Decision:** Treat trustworthy navigation as a long-term architectural capability: recommendations must use evidence, context, uncertainty, and user goals rather than generic advice.

## ADR-013 — AI and Memory

**Decision:** AI capability is an architectural concern, not a superficial UI feature. Memory, personal modeling, evidence, and outcome learning must be designed so future Personal AI Coach, Research Assistant, agents, predictive recommendations, and Digital Twin capabilities can be added without a foundational rewrite.
