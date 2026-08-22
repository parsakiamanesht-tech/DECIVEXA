CREATE TABLE "decivexa"."personal_state_revisions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"revision" integer NOT NULL,
	"timezone" text,
	"locale" text,
	"availability" text,
	"provenance" text NOT NULL,
	"evidence_version_id" text,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_state_revisions_availability_check" CHECK ("decivexa"."personal_state_revisions"."availability" is null or "decivexa"."personal_state_revisions"."availability" in ('available','limited','unavailable')),
	CONSTRAINT "personal_state_revisions_provenance_check" CHECK ("decivexa"."personal_state_revisions"."provenance" in ('declared','observed')),
	CONSTRAINT "personal_state_revisions_revision_check" CHECK ("decivexa"."personal_state_revisions"."revision" >= 1)
);
--> statement-breakpoint
ALTER TABLE "decivexa"."personal_state_revisions" ADD CONSTRAINT "personal_state_revisions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_state_revisions" ADD CONSTRAINT "personal_state_revisions_state_owner_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."personal_states"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_state_revisions" ADD CONSTRAINT "personal_state_revisions_evidence_version_fk" FOREIGN KEY ("evidence_version_id") REFERENCES "decivexa"."evidence_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personal_state_revisions_user_id_revision_unique" ON "decivexa"."personal_state_revisions" USING btree ("user_id","revision");--> statement-breakpoint
-- Backfill: for every existing personal_states row, record exactly one
-- historical revision using its actual current field values. This is the
-- earliest point at which history begins being recorded for a pre-existing
-- row - it preserves whatever revision number that row is already at (which
-- may be greater than 1) and does NOT reconstruct revisions 1..N-1, which
-- were never captured and cannot be recovered.
INSERT INTO "decivexa"."personal_state_revisions"
  ("id", "user_id", "revision", "timezone", "locale", "availability", "provenance", "evidence_version_id", "created_at")
SELECT
  gen_random_uuid()::text,
  "user_id",
  "revision",
  "timezone",
  "locale",
  "availability",
  "provenance",
  NULL,
  "updated_at"
FROM "decivexa"."personal_states";
