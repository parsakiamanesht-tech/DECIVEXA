import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { RequestContext } from "../../context/request-context";
import { failure, success, type Result } from "../../shared/result/result";
import { USER_CREDENTIALS_REPOSITORY, type UserCredentialsRepository } from "./user-credentials.repository";
import { AccessTokenService } from "../../infrastructure/auth/access-token.service";
import { PasswordService } from "../../infrastructure/auth/password.service";
import type { AuthenticatedIdentity } from "./authentication.contract";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_CREDENTIALS_REPOSITORY) private readonly users: UserCredentialsRepository,
    private readonly passwords: PasswordService,
    private readonly tokens: AccessTokenService,
  ) {}

  async execute(
    input: Readonly<{ email: string; password: string }>,
    _context: RequestContext,
  ): Promise<Result<AuthenticatedIdentity>> {
    const email = input.email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email) || input.password.length < 8) {
      return failure(new Error("Invalid registration input"));
    }

    if (await this.users.findByEmail(email)) {
      return failure(new Error("Email already registered"));
    }

    const user = await this.users.create({
      id: randomUUID(),
      email,
      passwordHash: await this.passwords.hash(input.password),
      now: new Date(),
    });

    return success({
      userId: user.id,
      email: user.email,
      accessToken: this.tokens.issue({ userId: user.id, email: user.email }),
    });
  }
}
