import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { RequestContext } from "../../context/request-context";
import { ValidationError } from "../../shared/errors/validation-error";
import { ApplicationError } from "../../shared/errors/application-error";
import { failure, success, type Result } from "../../shared/result/result";
import { USER_CREDENTIALS_REPOSITORY, type UserCredentialsRepository } from "./user-credentials.repository";
import { ACCESS_TOKEN_SERVICE, type AccessTokenServicePort } from "./access-token.service.port";
import { PASSWORD_SERVICE, type PasswordServicePort } from "./password.service.port";
import type { AuthenticatedIdentity } from "./authentication.contract";

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_CREDENTIALS_REPOSITORY) private readonly users: UserCredentialsRepository,
    @Inject(PASSWORD_SERVICE) private readonly passwords: PasswordServicePort,
    @Inject(ACCESS_TOKEN_SERVICE) private readonly tokens: AccessTokenServicePort,
  ) {}

  async execute(
    input: Readonly<{ email: string; password: string }>,
    _context: RequestContext,
  ): Promise<Result<AuthenticatedIdentity>> {
    const email = input.email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email) || input.password.length < 8) {
      return failure(new ValidationError("Invalid registration input"));
    }

    if (await this.users.findByEmail(email)) {
      return failure(new ApplicationError("EMAIL_ALREADY_REGISTERED", "Email already registered"));
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
