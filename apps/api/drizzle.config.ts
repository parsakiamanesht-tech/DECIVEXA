import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/persistence/schema/index.ts",
  out: "./src/persistence/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://decivexa:decivexa@localhost:5432/decivexa",
  },
});
