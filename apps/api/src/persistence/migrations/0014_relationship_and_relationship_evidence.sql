CREATE TABLE "decivexa"."personal_intelligence_relationship_evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"relationship_id" text NOT NULL,
	"user_id" text NOT NULL,
	"sequence" integer NOT NULL,
	"description" text NOT NULL,
	"evidence_version_id" text,
	"provenance" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_relationship_evidence_sequence_check" CHECK ("decivexa"."personal_intelligence_relationship_evidence"."sequence" >= 1),
	CONSTRAINT "personal_intelligence_relationship_evidence_provenance_check" CHECK ("decivexa"."personal_intelligence_relationship_evidence"."provenance" in ('ai_hypothesis','system_derived','user_declared'))
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_relationships" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"source_claim_version_id" text NOT NULL,
	"target_claim_version_id" text NOT NULL,
	"relationship_type" text NOT NULL,
	"certainty" text NOT NULL,
	"confirmation_state" text NOT NULL,
	"provenance" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_relationships_relationship_type_check" CHECK ("decivexa"."personal_intelligence_relationships"."relationship_type" in ('successive_state','refinement','contradiction','contextual_variation','related_fact')),
	CONSTRAINT "personal_intelligence_relationships_certainty_check" CHECK ("decivexa"."personal_intelligence_relationships"."certainty" in ('certain','uncertain','unknown')),
	CONSTRAINT "personal_intelligence_relationships_confirmation_state_check" CHECK ("decivexa"."personal_intelligence_relationships"."confirmation_state" in ('not_required','pending','confirmed','rejected')),
	CONSTRAINT "personal_intelligence_relationships_provenance_check" CHECK ("decivexa"."personal_intelligence_relationships"."provenance" in ('ai_hypothesis','system_derived','user_declared'))
);
--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationship_evidence" ADD CONSTRAINT "personal_intelligence_relationship_evidence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationship_evidence" ADD CONSTRAINT "personal_intelligence_relationship_evidence_relationship_owner_fk" FOREIGN KEY ("relationship_id","user_id") REFERENCES "decivexa"."personal_intelligence_relationships"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationship_evidence" ADD CONSTRAINT "personal_intelligence_relationship_evidence_evidence_version_fk" FOREIGN KEY ("evidence_version_id") REFERENCES "decivexa"."evidence_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationships" ADD CONSTRAINT "personal_intelligence_relationships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationships" ADD CONSTRAINT "personal_intelligence_relationships_source_claim_version_fk" FOREIGN KEY ("source_claim_version_id") REFERENCES "decivexa"."personal_intelligence_claim_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationships" ADD CONSTRAINT "personal_intelligence_relationships_target_claim_version_fk" FOREIGN KEY ("target_claim_version_id") REFERENCES "decivexa"."personal_intelligence_claim_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_relationship_evidence_relationship_id_sequence_unique" ON "decivexa"."personal_intelligence_relationship_evidence" USING btree ("relationship_id","sequence");--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_relationships_id_user_id_unique" ON "decivexa"."personal_intelligence_relationships" USING btree ("id","user_id");