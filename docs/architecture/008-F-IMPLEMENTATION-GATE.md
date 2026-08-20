# DECIVEXA Increment 008-F — Implementation Gate

## Status

Implementation scope approved by Founder.

## Implement

- Resource Identity Contract
- ResourceReference contract
- Identity immutability rules at the domain-contract level
- Separation of identity from ownership, lifecycle, access, transport, and persistence

## Defer

- Workspace `text` → ULID migration
- ULID generation dependency
- Public resource URI/API
- Universal resource table
- Polymorphic persistence relations
- Resource versioning
- Event sourcing

## Non-negotiable constraints

- No new database migration
- Existing Workspace persistence remains unchanged
- Access Boundary remains unchanged
- No Goal OS implementation
- No scope expansion
