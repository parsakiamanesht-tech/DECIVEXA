import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { createDatabase, type DatabaseClient } from "./database";

type DatabaseResources = ReturnType<typeof createDatabase>;

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly resources: DatabaseResources;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required to initialize the database");
    }

    this.resources = createDatabase(connectionString);
  }

  get client(): DatabaseClient {
    return this.resources.client;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.resources.pool.end();
  }
}
