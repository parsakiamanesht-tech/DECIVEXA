CREATE TABLE "decivexa"."personal_intelligence_claim_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"claim_id" text NOT NULL,
	"user_id" text NOT NULL,
	"version" integer NOT NULL,
	"value_kind" text NOT NULL,
	"value_text" text NOT NULL,
	"provenance" text NOT NULL,
	"confidence" real NOT NULL,
	"lifecycle" text DEFAULT 'active' NOT NULL,
	"evidence_version_id" text,
	"observed_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_claim_versions_version_check" CHECK ("decivexa"."personal_intelligence_claim_versions"."version" >= 1),
	CONSTRAINT "personal_intelligence_claim_versions_value_kind_check" CHECK ("decivexa"."personal_intelligence_claim_versions"."value_kind" in ('text','boolean','enum')),
	CONSTRAINT "personal_intelligence_claim_versions_provenance_check" CHECK ("decivexa"."personal_intelligence_claim_versions"."provenance" in ('declared','observed')),
	CONSTRAINT "personal_intelligence_claim_versions_confidence_check" CHECK ("decivexa"."personal_intelligence_claim_versions"."confidence" >= 0 and "decivexa"."personal_intelligence_claim_versions"."confidence" <= 1),
	CONSTRAINT "personal_intelligence_claim_versions_lifecycle_check" CHECK ("decivexa"."personal_intelligence_claim_versions"."lifecycle" in ('active','superseded','corrected','revoked','disputed'))
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_claims" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"claim_type" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_claims_claim_type_check" CHECK ("decivexa"."personal_intelligence_claims"."claim_type" in ('identity_attribute','value','preference','capability','constraint','environment_context','strength','weakness','behavior_pattern'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_claim_versions_claim_id_version_unique" ON "decivexa"."personal_intelligence_claim_versions" USING btree ("claim_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_claims_id_user_id_unique" ON "decivexa"."personal_intelligence_claims" USING btree ("id","user_id");--> statement-breakpoint
ALTER TABLE "decivexa"."personal_states" DROP CONSTRAINT "personal_states_availability_check";--> statement-breakpoint
ALTER TABLE "decivexa"."personal_states" DROP CONSTRAINT "personal_states_provenance_check";--> statement-breakpoint
ALTER TABLE "decivexa"."personal_states" DROP CONSTRAINT "personal_states_revision_check";--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD CONSTRAINT "personal_intelligence_claim_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD CONSTRAINT "personal_intelligence_claim_versions_claim_owner_fk" FOREIGN KEY ("claim_id","user_id") REFERENCES "decivexa"."personal_intelligence_claims"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD CONSTRAINT "personal_intelligence_claim_versions_evidence_version_fk" FOREIGN KEY ("evidence_version_id") REFERENCES "decivexa"."evidence_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claims" ADD CONSTRAINT "personal_intelligence_claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_states" ADD CONSTRAINT "personal_states_availability_check" CHECK ("decivexa"."personal_states"."availability" is null or "decivexa"."personal_states"."availability" in ('available','limited','unavailable'));--> statement-breakpoint
ALTER TABLE "decivexa"."personal_states" ADD CONSTRAINT "personal_states_provenance_check" CHECK ("decivexa"."personal_states"."provenance" in ('declared','observed'));--> statement-breakpoint
ALTER TABLE "decivexa"."personal_states" ADD CONSTRAINT "personal_states_revision_check" CHECK ("decivexa"."personal_states"."revision" >= 1);
