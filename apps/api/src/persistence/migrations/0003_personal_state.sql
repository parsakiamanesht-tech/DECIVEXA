CREATE TABLE "decivexa"."personal_states" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "timezone" text,
  "locale" text,
  "availability" text,
  "provenance" text DEFAULT 'declared' NOT NULL,
  "revision" integer DEFAULT 1 NOT NULL,
  "created_at" timestamp with time zone NOT NULL,
  "updated_at" timestamp with time zone NOT NULL,
  CONSTRAINT "personal_states_availability_check" CHECK ("availability" IS NULL OR "availability" IN ('available','limited','unavailable')),
  CONSTRAINT "personal_states_provenance_check" CHECK ("provenance" IN ('declared','observed')),
  CONSTRAINT "personal_states_revision_check" CHECK ("revision" >= 1)
);
--> statement-breakpoint
ALTER TABLE "decivexa"."personal_states" ADD CONSTRAINT "personal_states_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "personal_states_user_id_unique" ON "decivexa"."personal_states" USING btree ("user_id");
