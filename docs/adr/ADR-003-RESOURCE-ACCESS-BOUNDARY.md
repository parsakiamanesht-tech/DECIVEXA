# ADR-003: Resource Access Boundary

## Status
Accepted

## Date
2026-08-21

## Context
DECIVEXA currently uses Workspace as its first Core Resource primitive. Workspace ownership provides the minimal access rule required by the current foundation.

## Decision
Workspace is a Resource primitive owned by a User Identity through `ownerId`.

The current access policy remains deliberately minimal:

- the owner may perform the currently supported read/write operations;
- a non-owner is denied;
- lifecycle remains a separate resource concern;
- ownership is not presented as a complete Authorization Platform.

Authentication, authorization policy engines, RBAC, ABAC, roles, permissions, delegation, sharing, and collaboration are outside this boundary.

## Consequences
Existing Workspace access and lifecycle primitives remain the source of behavior. New resource types or richer authorization semantics require their own architecture and implementation gates.

## Scope Guardrail
Do not introduce generic role/permission infrastructure or collaboration semantics as part of CORE-FOUNDATION-01.
