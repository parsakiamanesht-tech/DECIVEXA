CREATE TABLE "decivexa"."personal_intelligence_relationship_confirmation_events" (
	"id" text PRIMARY KEY NOT NULL,
	"relationship_id" text NOT NULL,
	"user_id" text NOT NULL,
	"sequence" integer NOT NULL,
	"action" text NOT NULL,
	"actor" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "personal_intelligence_relationship_confirmation_events_sequence_check" CHECK ("decivexa"."personal_intelligence_relationship_confirmation_events"."sequence" >= 1),
	CONSTRAINT "personal_intelligence_relationship_confirmation_events_action_check" CHECK ("decivexa"."personal_intelligence_relationship_confirmation_events"."action" in ('pending','confirmed','rejected')),
	CONSTRAINT "personal_intelligence_relationship_confirmation_events_actor_check" CHECK ("decivexa"."personal_intelligence_relationship_confirmation_events"."actor" in ('user'))
);
--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationship_confirmation_events" ADD CONSTRAINT "personal_intelligence_relationship_confirmation_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "decivexa"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "decivexa"."personal_intelligence_relationship_confirmation_events" ADD CONSTRAINT "personal_intelligence_relationship_confirmation_events_relationship_owner_fk" FOREIGN KEY ("relationship_id","user_id") REFERENCES "decivexa"."personal_intelligence_relationships"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "personal_intelligence_relationship_confirmation_events_relationship_id_sequence_unique" ON "decivexa"."personal_intelligence_relationship_confirmation_events" USING btree ("relationship_id","sequence");