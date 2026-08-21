import { Inject, Injectable } from "@nestjs/common";
import type { RequestContext } from "../../context/request-context";
import { failure, success, type Result } from "../../shared/result/result";
import { USER_CREDENTIALS_REPOSITORY, type UserCredentialsRepository } from "./user-credentials.repository";
import { AccessTokenService } from "../../infrastructure/auth/access-token.service";
import { PasswordService } from "../../infrastructure/auth/password.service";
import type { AuthenticatedIdentity, AuthenticateUserInput } from "./authentication.contract";

const INVALID_CREDENTIALS = new Error("Invalid credentials");

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_CREDENTIALS_REPOSITORY) private readonly users: UserCredentialsRepository,
    private readonly passwords: PasswordService,
    private readonly tokens: AccessTokenService,
  ) {}

  async execute(
    input: AuthenticateUserInput,
    _context: RequestContext,
  ): Promise<Result<AuthenticatedIdentity>> {
    const email = input.email.trim().toLowerCase();
    if (!email || !input.password) return failure(INVALID_CREDENTIALS);

    const user = await this.users.findByEmail(email);
    if (!user || !(await this.passwords.verify(input.password, user.passwordHash))) {
      return failure(INVALID_CREDENTIALS);
    }

    return success({
      userId: user.id,
      email: user.email,
      accessToken: this.tokens.issue({ userId: user.id, email: user.email }),
    });
  }
}
