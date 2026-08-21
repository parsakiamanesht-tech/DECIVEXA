import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { createRequestContext, type RequestContext } from "../../context/request-context";
import { AccessTokenService } from "./access-token.service";

type AuthenticatedRequest = {
  headers: Record<string, string | string[] | undefined>;
  context?: RequestContext;
};

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly tokens: AccessTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization;
    const token = typeof header === "string" && header.startsWith("Bearer ")
      ? header.slice("Bearer ".length).trim()
      : "";
    const claims = token ? this.tokens.verify(token) : undefined;

    if (!claims) throw new UnauthorizedException("Authentication required");
    request.context = createRequestContext(randomUUID(), claims.userId);
    return true;
  }
}
