CREATE TABLE "decivexa"."memory_record_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"record_id" text NOT NULL,
	"user_id" text NOT NULL,
	"version" integer NOT NULL,
	"provenance" text NOT NULL,
	"lifecycle" text DEFAULT 'active' NOT NULL,
	"observed_at" timestamp with time zone NOT NULL,
	"accepted_at" timestamp with time zone NOT NULL,
	"confidence" real,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "memory_record_versions_version_check" CHECK ("decivexa"."memory_record_versions"."version" >= 1),
	CONSTRAINT "memory_record_versions_provenance_check" CHECK ("decivexa"."memory_record_versions"."provenance" in ('declared','observed')),
	CONSTRAINT "memory_record_versions_lifecycle_check" CHECK ("decivexa"."memory_record_versions"."lifecycle" in ('active','corrected','deleted'))
);
--> statement-breakpoint
CREATE TABLE "decivexa"."memory_records" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "decivexa"."memory_record_versions" ADD CONSTRAINT "memory_record_versions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."memory_record_versions" ADD CONSTRAINT "memory_record_versions_record_owner_fk" FOREIGN KEY ("record_id","user_id") REFERENCES "decivexa"."memory_records"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."memory_records" ADD CONSTRAINT "memory_records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "memory_record_versions_record_id_version_unique" ON "decivexa"."memory_record_versions" USING btree ("record_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "memory_records_id_user_id_unique" ON "decivexa"."memory_records" USING btree ("id","user_id");