CREATE SCHEMA IF NOT EXISTS "decivexa";

CREATE TABLE "decivexa"."users" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
