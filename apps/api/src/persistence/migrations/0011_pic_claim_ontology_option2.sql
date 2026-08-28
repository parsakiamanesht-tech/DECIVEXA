CREATE TABLE "decivexa"."personal_intelligence_claim_confirmation_events" (
	"id" text PRIMARY KEY NOT NULL,
	"claim_id" text NOT NULL,
	"claim_version_id" text NOT NULL,
	"user_id" text NOT NULL,
	"sequence" integer NOT NULL,
	"action" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_claim_confirmation_events_sequence_check" CHECK ("decivexa"."personal_intelligence_claim_confirmation_events"."sequence" >= 1),
	CONSTRAINT "personal_intelligence_claim_confirmation_events_action_check" CHECK ("decivexa"."personal_intelligence_claim_confirmation_events"."action" in ('confirmed','unconfirmed'))
);
--> statement-breakpoint
-- PIC Claim Ontology / Taxonomy Option 2 (Implementation Increment
-- Contract §3.1): the column is added nullable first, backfilled from the
-- existing evidenceVersionId presence/absence per the Contract's approved,
-- conservative backfill rule, then tightened to NOT NULL - a plain
-- "ADD COLUMN ... NOT NULL" would fail outright against any pre-existing
-- row.
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD COLUMN "evidence_linkage_state" text;--> statement-breakpoint
UPDATE "decivexa"."personal_intelligence_claim_versions" SET "evidence_linkage_state" = 'linked' WHERE "evidence_version_id" IS NOT NULL;--> statement-breakpoint
-- Conservative default (Contract §3.1): every pre-existing row with no
-- linked evidence becomes 'linkage_pending', never
-- 'self_reported_no_evidence_required' - this never retroactively asserts
-- an evidence-exemption that was never actually declared.
UPDATE "decivexa"."personal_intelligence_claim_versions" SET "evidence_linkage_state" = 'linkage_pending' WHERE "evidence_version_id" IS NULL;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ALTER COLUMN "evidence_linkage_state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_confirmation_events" ADD CONSTRAINT "personal_intelligence_claim_confirmation_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_confirmation_events" ADD CONSTRAINT "personal_intelligence_claim_confirmation_events_claim_owner_fk" FOREIGN KEY ("claim_id","user_id") REFERENCES "decivexa"."personal_intelligence_claims"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_confirmation_events" ADD CONSTRAINT "personal_intelligence_claim_confirmation_events_claim_version_fk" FOREIGN KEY ("claim_version_id") REFERENCES "decivexa"."personal_intelligence_claim_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_claim_confirmation_events_claim_id_sequence_unique" ON "decivexa"."personal_intelligence_claim_confirmation_events" USING btree ("claim_id","sequence");--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD CONSTRAINT "personal_intelligence_claim_versions_evidence_linkage_state_check" CHECK ("decivexa"."personal_intelligence_claim_versions"."evidence_linkage_state" in ('linked','self_reported_no_evidence_required','linkage_pending'));--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD CONSTRAINT "personal_intelligence_claim_versions_evidence_linkage_coupling_check" CHECK (("decivexa"."personal_intelligence_claim_versions"."evidence_linkage_state" = 'linked' and "decivexa"."personal_intelligence_claim_versions"."evidence_version_id" is not null) or ("decivexa"."personal_intelligence_claim_versions"."evidence_linkage_state" <> 'linked' and "decivexa"."personal_intelligence_claim_versions"."evidence_version_id" is null));