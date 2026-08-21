import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { persistenceSchema } from "./schema";

export const createDatabase = (connectionString: string) => {
  const pool = new Pool({ connectionString });
  return {
    client: drizzle(pool, { schema: persistenceSchema }),
    pool,
  };
};

export type DatabaseClient = ReturnType<typeof createDatabase>["client"];
