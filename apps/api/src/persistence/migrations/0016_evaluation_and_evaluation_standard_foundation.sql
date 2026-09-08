CREATE TABLE "decivexa"."personal_intelligence_evaluation_evidence_references" (
	"evaluation_id" text NOT NULL,
	"evidence_version_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "personal_intelligence_evaluation_evidence_references_pk" PRIMARY KEY("evaluation_id","evidence_version_id")
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_evaluation_standard_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"standard_id" text NOT NULL,
	"user_id" text NOT NULL,
	"version" integer NOT NULL,
	"criteria" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_evaluation_standard_versions_version_check" CHECK ("decivexa"."personal_intelligence_evaluation_standard_versions"."version" >= 1)
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_evaluation_standards" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decivexa"."personal_intelligence_evaluations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"claim_version_id" text NOT NULL,
	"evaluation_standard_version_id" text NOT NULL,
	"result" text NOT NULL,
	"evaluator_type" text NOT NULL,
	"producer_capability_id" text,
	"producer_capability_version" text,
	"producer_provider_id" text,
	"producer_model_id" text,
	"model_reported_confidence" real,
	"system_adjusted_confidence" real,
	"supersedes_evaluation_id" text,
	"evaluated_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_evaluations_result_check" CHECK ("decivexa"."personal_intelligence_evaluations"."result" in ('sufficient','insufficient')),
	CONSTRAINT "personal_intelligence_evaluations_evaluator_type_check" CHECK ("decivexa"."personal_intelligence_evaluations"."evaluator_type" in ('human','system_deterministic','ai'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_evaluation_standards_id_user_id_unique" ON "decivexa"."personal_intelligence_evaluation_standards" USING btree ("id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_evaluations_id_user_id_unique" ON "decivexa"."personal_intelligence_evaluations" USING btree ("id","user_id");--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluation_evidence_references" ADD CONSTRAINT "personal_intelligence_evaluation_evidence_references_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluation_evidence_references" ADD CONSTRAINT "personal_intelligence_evaluation_evidence_references_evaluation_owner_fk" FOREIGN KEY ("evaluation_id","user_id") REFERENCES "decivexa"."personal_intelligence_evaluations"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluation_evidence_references" ADD CONSTRAINT "personal_intelligence_evaluation_evidence_references_evidence_version_fk" FOREIGN KEY ("evidence_version_id") REFERENCES "decivexa"."evidence_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluation_standard_versions" ADD CONSTRAINT "personal_intelligence_evaluation_standard_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluation_standard_versions" ADD CONSTRAINT "personal_intelligence_evaluation_standard_versions_standard_owner_fk" FOREIGN KEY ("standard_id","user_id") REFERENCES "decivexa"."personal_intelligence_evaluation_standards"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluation_standards" ADD CONSTRAINT "personal_intelligence_evaluation_standards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluations" ADD CONSTRAINT "personal_intelligence_evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluations" ADD CONSTRAINT "personal_intelligence_evaluations_standard_version_fk" FOREIGN KEY ("evaluation_standard_version_id") REFERENCES "decivexa"."personal_intelligence_evaluation_standard_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_evaluations" ADD CONSTRAINT "personal_intelligence_evaluations_supersedes_fk" FOREIGN KEY ("supersedes_evaluation_id") REFERENCES "decivexa"."personal_intelligence_evaluations"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_evaluation_standard_versions_standard_id_version_unique" ON "decivexa"."personal_intelligence_evaluation_standard_versions" USING btree ("standard_id","version");