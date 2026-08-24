ALTER TABLE "decivexa"."memory_record_versions" ADD COLUMN "value_kind" text;--> statement-breakpoint
ALTER TABLE "decivexa"."memory_record_versions" ADD COLUMN "value" text;--> statement-breakpoint
ALTER TABLE "decivexa"."memory_record_versions" ADD COLUMN "user_confirmed" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "decivexa"."memory_record_versions" ADD CONSTRAINT "memory_record_versions_value_kind_check" CHECK ("decivexa"."memory_record_versions"."value_kind" is null or "decivexa"."memory_record_versions"."value_kind" in ('content','reference'));