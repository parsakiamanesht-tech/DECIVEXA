# ADR-003: Persistence Stack

- Status: Accepted
- Date: 2026-08-19
- Decision owner: Founder

## Context
DECIVEXA requires a durable persistence layer that can support relational integrity, transactional decision operations, evolving schemas, auditability, future Memory and Personal Intelligence capabilities, and a stable Repository Boundary.

## Decision
Use **PostgreSQL** as the primary relational database and **Drizzle ORM** as the TypeScript data-access and schema/migration layer.

## Architectural constraints
- Preserve the Persistence Boundary introduced in Implementation Increment 002.
- Keep domain/application code independent from Drizzle-specific APIs where practical.
- Use version-controlled migrations as the authoritative schema evolution mechanism.
- Treat transactions as an explicit persistence concern rather than leaking database details into domain logic.
- Design IDs, timestamps, audit metadata, and JSON-capable fields with future Memory/AI requirements in mind.
- Do not introduce module-specific business schemas in this increment.

## Alternatives considered
- Prisma: strong type safety and mature NestJS integration, but a higher abstraction layer and stronger coupling to its generated client/schema model.
- TypeORM: mature NestJS ecosystem, but entity-centric behavior and ORM conventions add complexity that is not required by the current persistence boundary.
- SQL-first without an ORM: maximum database control, but greater implementation burden and weaker shared TypeScript schema ergonomics for the current team.

## Consequences
Positive:
- PostgreSQL provides strong relational integrity and transaction semantics.
- Drizzle keeps SQL concepts visible while retaining TypeScript typing.
- Version-controlled migrations provide auditable schema evolution.
- The Repository Boundary remains available for future persistence changes.

Trade-offs:
- The team accepts more database-level responsibility than with a heavier ORM abstraction.
- Some advanced queries may require SQL-oriented Drizzle usage.
- PostgreSQL becomes the primary operational dependency for persistence.

## Scope boundary
This ADR authorizes the persistence technology choice only. It does not authorize Goal OS, Discipline OS, Review OS, DECIVEXA AI, Memory, or other product-module implementations.
