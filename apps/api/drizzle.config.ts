import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/core/identity/identity.schema.ts",
  out: "./src/persistence/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://decivexa:decivexa@localhost:5432/decivexa",
  },
});
