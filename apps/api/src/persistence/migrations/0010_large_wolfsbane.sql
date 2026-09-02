CREATE TABLE "decivexa"."personal_intelligence_inference_claim_context" (
	"inference_id" text NOT NULL,
	"claim_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "personal_intelligence_inference_claim_context_inference_id_claim_id_pk" PRIMARY KEY("inference_id","claim_id")
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_inference_evidence_references" (
	"inference_id" text NOT NULL,
	"evidence_version_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "personal_intelligence_inference_evidence_references_inference_id_evidence_version_id_pk" PRIMARY KEY("inference_id","evidence_version_id")
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_inference_lifecycle_events" (
	"id" text PRIMARY KEY NOT NULL,
	"inference_id" text NOT NULL,
	"user_id" text NOT NULL,
	"sequence" integer NOT NULL,
	"from_status" text,
	"to_status" text NOT NULL,
	"transitioned_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_inference_lifecycle_events_sequence_check" CHECK ("decivexa"."personal_intelligence_inference_lifecycle_events"."sequence" >= 1),
	CONSTRAINT "personal_intelligence_inference_lifecycle_events_from_status_check" CHECK ("decivexa"."personal_intelligence_inference_lifecycle_events"."from_status" is null or "decivexa"."personal_intelligence_inference_lifecycle_events"."from_status" in ('proposed','confirmed','rejected','disputed','stale')),
	CONSTRAINT "personal_intelligence_inference_lifecycle_events_to_status_check" CHECK ("decivexa"."personal_intelligence_inference_lifecycle_events"."to_status" in ('proposed','confirmed','rejected','disputed','stale'))
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_inferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"claim_type" text NOT NULL,
	"value_kind" text NOT NULL,
	"value_text" text NOT NULL,
	"generated_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"producer_capability_id" text NOT NULL,
	"producer_capability_version" text NOT NULL,
	"producer_provider_id" text NOT NULL,
	"producer_model_id" text NOT NULL,
	"model_reported_confidence" real,
	"system_adjusted_confidence" real,
	CONSTRAINT "personal_intelligence_inferences_claim_type_check" CHECK ("decivexa"."personal_intelligence_inferences"."claim_type" in ('identity_attribute','value','preference','capability','constraint','environment_context','strength','weakness','behavior_pattern')),
	CONSTRAINT "personal_intelligence_inferences_value_kind_check" CHECK ("decivexa"."personal_intelligence_inferences"."value_kind" in ('text','boolean','enum')),
	CONSTRAINT "personal_intelligence_inferences_model_reported_confidence_check" CHECK ("decivexa"."personal_intelligence_inferences"."model_reported_confidence" is null or ("decivexa"."personal_intelligence_inferences"."model_reported_confidence" >= 0 and "decivexa"."personal_intelligence_inferences"."model_reported_confidence" <= 1)),
	CONSTRAINT "personal_intelligence_inferences_system_adjusted_confidence_check" CHECK ("decivexa"."personal_intelligence_inferences"."system_adjusted_confidence" is null or ("decivexa"."personal_intelligence_inferences"."system_adjusted_confidence" >= 0 and "decivexa"."personal_intelligence_inferences"."system_adjusted_confidence" <= 1))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_inferences_id_user_id_unique" ON "decivexa"."personal_intelligence_inferences" USING btree ("id","user_id");--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD COLUMN "inference_id" text;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inference_claim_context" ADD CONSTRAINT "personal_intelligence_inference_claim_context_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inference_claim_context" ADD CONSTRAINT "personal_intelligence_inference_claim_context_inference_owner_fk" FOREIGN KEY ("inference_id","user_id") REFERENCES "decivexa"."personal_intelligence_inferences"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inference_evidence_references" ADD CONSTRAINT "personal_intelligence_inference_evidence_references_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inference_evidence_references" ADD CONSTRAINT "personal_intelligence_inference_evidence_references_inference_owner_fk" FOREIGN KEY ("inference_id","user_id") REFERENCES "decivexa"."personal_intelligence_inferences"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inference_evidence_references" ADD CONSTRAINT "personal_intelligence_inference_evidence_references_evidence_version_fk" FOREIGN KEY ("evidence_version_id") REFERENCES "decivexa"."evidence_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inference_lifecycle_events" ADD CONSTRAINT "personal_intelligence_inference_lifecycle_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inference_lifecycle_events" ADD CONSTRAINT "personal_intelligence_inference_lifecycle_events_inference_owner_fk" FOREIGN KEY ("inference_id","user_id") REFERENCES "decivexa"."personal_intelligence_inferences"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_inferences" ADD CONSTRAINT "personal_intelligence_inferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_inference_lifecycle_events_inference_id_sequence_unique" ON "decivexa"."personal_intelligence_inference_lifecycle_events" USING btree ("inference_id","sequence");--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_claim_versions" ADD CONSTRAINT "personal_intelligence_claim_versions_inference_fk" FOREIGN KEY ("inference_id") REFERENCES "decivexa"."personal_intelligence_inferences"("id") ON DELETE restrict ON UPDATE no action;