import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export const verifyDatabaseConnection = async (db: NodePgDatabase) => {
  await db.execute(sql`select 1`);
  return true;
};
