# DECIVEXA Persistence Migrations

This directory is reserved for version-controlled PostgreSQL migrations generated from the Drizzle schema.

Migration rules for the foundation stage:

- Domain/module tables are not introduced here.
- Migrations must be deterministic and committed to Git.
- Production/runtime startup must not implicitly mutate the database schema.
- Database connection and migration execution remain separate from API bootstrap.
