# ADR-002: Identity Boundary

## Status
Accepted

## Date
2026-08-21

## Context
DECIVEXA needs a stable identity primitive without prematurely turning Core Identity into an authentication platform. The current persistence model intentionally keeps `users` minimal.

## Decision
`User` is the Core Identity persistence primitive. Its responsibility is to provide a stable identity identifier and identity lifecycle metadata.

Identity is explicitly distinct from Authentication and Authorization.

- Identity answers: **which identity is this?**
- Authentication answers: **how was this identity authenticated?**
- Authorization answers: **is this actor allowed to perform this action on this resource?**

The Identity boundary must not contain passwords, sessions, JWT implementation, OAuth, MFA, roles, permissions, or other authentication-platform capabilities.

## Consequences
Future authentication capabilities must consume the Identity boundary through explicit architecture decisions. Adding credential or session concerns to the Identity schema requires a separate Gate.

## Scope Guardrail
This ADR does not authorize implementation of an Authentication Platform or Authorization Platform.
