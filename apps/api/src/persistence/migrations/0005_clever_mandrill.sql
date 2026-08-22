CREATE TABLE "decivexa"."evidence" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "decivexa"."evidence_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"evidence_id" text NOT NULL,
	"user_id" text NOT NULL,
	"version" integer NOT NULL,
	"provenance" text NOT NULL,
	"lifecycle" text DEFAULT 'active' NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone NOT NULL,
	"confidence" real,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "evidence_versions_version_check" CHECK ("decivexa"."evidence_versions"."version" >= 1),
	CONSTRAINT "evidence_versions_provenance_check" CHECK ("decivexa"."evidence_versions"."provenance" in ('declared','observed','measured')),
	CONSTRAINT "evidence_versions_lifecycle_check" CHECK ("decivexa"."evidence_versions"."lifecycle" in ('active','superseded','corrected','revoked','disputed'))
);
--> statement-breakpoint
ALTER TABLE "decivexa"."evidence" ADD CONSTRAINT "evidence_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."evidence_versions" ADD CONSTRAINT "evidence_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_id_user_id_unique" ON "decivexa"."evidence" USING btree ("id","user_id");--> statement-breakpoint
ALTER TABLE "decivexa"."evidence_versions" ADD CONSTRAINT "evidence_versions_evidence_owner_fk" FOREIGN KEY ("evidence_id","user_id") REFERENCES "decivexa"."evidence"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_versions_evidence_version_unique" ON "decivexa"."evidence_versions" USING btree ("evidence_id","version");
