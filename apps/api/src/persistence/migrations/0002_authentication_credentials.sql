ALTER TABLE "decivexa"."users"
  ADD COLUMN "email" text,
  ADD COLUMN "password_hash" text;

UPDATE "decivexa"."users"
SET
  "email" = COALESCE("email", 'legacy-' || "id" || '@invalid.local'),
  "password_hash" = COALESCE("password_hash", 'DISABLED_LEGACY_CREDENTIAL');

ALTER TABLE "decivexa"."users"
  ALTER COLUMN "email" SET NOT NULL,
  ALTER COLUMN "password_hash" SET NOT NULL;

CREATE UNIQUE INDEX "users_email_unique" ON "decivexa"."users" ("email");
