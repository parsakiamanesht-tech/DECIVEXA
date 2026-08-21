import { eq } from "drizzle-orm";
import type { DatabaseClient } from "../../persistence/database";
import { users } from "../../persistence/schema/identity.schema";
import type { UserCredentials, UserCredentialsRepository } from "../../application/auth/user-credentials.repository";

export class DrizzleUserCredentialsRepository implements UserCredentialsRepository {
  constructor(private readonly database: DatabaseClient) {}

  async findByEmail(email: string): Promise<UserCredentials | undefined> {
    const rows = await this.database
      .select({ id: users.id, email: users.email, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return rows[0];
  }

  async create(input: Readonly<{ id: string; email: string; passwordHash: string; now: Date }>): Promise<UserCredentials> {
    const rows = await this.database
      .insert(users)
      .values({
        id: input.id,
        email: input.email,
        passwordHash: input.passwordHash,
        createdAt: input.now,
        updatedAt: input.now,
      })
      .returning({ id: users.id, email: users.email, passwordHash: users.passwordHash });

    const user = rows[0];
    if (!user) throw new Error("Failed to create user");
    return user;
  }
}
