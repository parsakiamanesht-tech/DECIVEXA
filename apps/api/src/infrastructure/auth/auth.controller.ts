import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { createRequestContext, type RequestContext } from "../../context/request-context";
import { AuthenticateUserUseCase } from "../../application/auth/authenticate-user.use-case";
import { RegisterUserUseCase } from "../../application/auth/register-user.use-case";
import { AuthenticationGuard } from "./authentication.guard";
import { mapAuthenticationError } from "./auth-error.mapper";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authenticate: AuthenticateUserUseCase,
    private readonly register: RegisterUserUseCase,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() body: { email?: string; password?: string }) {
    const context = createRequestContext("registration");
    const result = await this.register.execute(
      { email: body.email ?? "", password: body.password ?? "" },
      context,
    );
    if (!result.ok) throw mapAuthenticationError(result.error, context);
    return result.value;
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email?: string; password?: string }) {
    const context = createRequestContext("login");
    const result = await this.authenticate.execute(
      { email: body.email ?? "", password: body.password ?? "" },
      context,
    );
    if (!result.ok) throw mapAuthenticationError(result.error, context);
    return result.value;
  }

  @Get("me")
  @UseGuards(AuthenticationGuard)
  me(@Req() request: { context?: RequestContext }) {
    if (!request.context?.userId) throw new UnauthorizedException("Authentication required");
    return { userId: request.context.userId, requestId: request.context.requestId };
  }
}
