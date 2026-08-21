# ADR-002: CORE-FOUNDATION-02 Application and Domain Boundary

## Status
Accepted

## Date
2026-08-21

## Context
DECIVEXA's restored foundation contains API, identity/resource boundaries, persistence, and Web verification. The next architectural risk is allowing future product capabilities to connect HTTP handlers directly to persistence or to introduce their own context, error, and observability conventions.

## Decision
Establish a minimal boundary architecture for future use cases:

- Application owns use-case orchestration.
- Domain owns domain rules and remains independent of HTTP, persistence implementations, frameworks, and AI providers.
- Request context is deliberately small and carries request identity plus optional user identity; full personal intelligence is not injected into every use case.
- Results and errors use explicit shared contracts so domain, application, and infrastructure failures remain distinguishable.
- Audit events carry operational metadata only and must not contain secrets or raw personal payloads.
- AI and Memory are reserved as future boundaries only; no provider, engine, agent, or memory implementation is introduced here.

## Consequences
Future feature work can build on stable boundaries without forcing product modules to own transport or infrastructure concerns. The foundation remains intentionally small and reversible.

## Non-goals
This decision does not implement Goal OS, Decision Engine, Human Intelligence, Memory Engine, Personal AI Coach, Digital Twin, agents, voice, mobile, full authentication, or production deployment.
