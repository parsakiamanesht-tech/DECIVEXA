ALTER TABLE "decivexa"."workspaces" ADD COLUMN "lifecycle_state" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "decivexa"."workspaces" ADD CONSTRAINT "workspaces_lifecycle_state_check" CHECK ("decivexa"."workspaces"."lifecycle_state" in ('active', 'archived'));
