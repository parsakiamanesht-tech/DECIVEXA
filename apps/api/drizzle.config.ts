import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: [
    "./src/persistence/schema/identity.schema.ts",
    "./src/persistence/schema/workspace.schema.ts",
    "./src/persistence/schema/personal-state.schema.ts",
    "./src/persistence/schema/evidence.schema.ts",
    "./src/persistence/schema/personal-intelligence.schema.ts",
    "./src/persistence/schema/personal-intelligence-inference.schema.ts",
    "./src/persistence/schema/memory.schema.ts",
  ],
  out: "./src/persistence/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://decivexa:decivexa@localhost:5432/decivexa",
  },
});
