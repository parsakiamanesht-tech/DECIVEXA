import type { RequestContext } from "../../context/request-context";
import type { Result } from "../../shared/result/result";

export type AuthenticateUserInput = Readonly<{
  email: string;
  password: string;
}>;

export type AuthenticatedIdentity = Readonly<{
  userId: string;
  email: string;
  accessToken: string;
}>;

export interface AuthenticationContract {
  execute(
    input: AuthenticateUserInput,
    context: RequestContext,
  ): Promise<Result<AuthenticatedIdentity>>;
}

export const AUTHENTICATION_CONTRACT = Symbol("AUTHENTICATION_CONTRACT");
