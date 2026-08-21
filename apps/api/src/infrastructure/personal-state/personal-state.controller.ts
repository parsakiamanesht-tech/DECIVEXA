import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, UnauthorizedException, ConflictException, NotFoundException, BadRequestException, UseGuards } from "@nestjs/common";
import type { RequestContext } from "../../context/request-context";
import { PersonalStateConflictError, PersonalStateNotFoundError, PersonalStateUseCase, type PersonalStateInput } from "../../application/personal-state/personal-state.use-case";
import { AuthenticationGuard } from "../auth/authentication.guard";

type AuthenticatedRequest = { context?: RequestContext };

function contextOf(request: AuthenticatedRequest): RequestContext {
  if (!request.context?.userId) throw new UnauthorizedException("Authentication required");
  return request.context;
}

@Controller("personal-state")
@UseGuards(AuthenticationGuard)
export class PersonalStateController {
  constructor(private readonly state: PersonalStateUseCase) {}

  @Get()
  async get(@Req() request: AuthenticatedRequest) {
    const result = await this.state.get(contextOf(request));
    if (!result.ok) {
      if (result.error instanceof PersonalStateNotFoundError) throw new NotFoundException(result.error.message);
      throw new BadRequestException(result.error.message);
    }
    return result.value;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async initialize(@Body() body: PersonalStateInput, @Req() request: AuthenticatedRequest) {
    const result = await this.state.initialize(body ?? {}, contextOf(request));
    if (!result.ok) {
      if (result.error.message.includes("required")) throw new UnauthorizedException(result.error.message);
      if (result.error.message.includes("Invalid")) throw new BadRequestException(result.error.message);
      throw new ConflictException(result.error.message);
    }
    return result.value;
  }

  @Patch()
  async update(@Body() body: PersonalStateInput & { revision?: number }, @Req() request: AuthenticatedRequest) {
    const result = await this.state.update({ ...(body ?? {}), revision: body?.revision ?? 0 }, contextOf(request));
    if (!result.ok) {
      if (result.error instanceof PersonalStateConflictError) throw new ConflictException(result.error.message);
      throw new BadRequestException(result.error.message);
    }
    return result.value;
  }
}
