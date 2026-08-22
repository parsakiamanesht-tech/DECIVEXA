import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import type { RequestContext } from "../../context/request-context";
import {
  EvidenceConflictError,
  EvidenceNotFoundError,
  EvidenceUseCase,
  type EvidenceCreateInput,
} from "../../application/evidence/evidence.use-case";
import type { EvidenceLifecycle, EvidenceProvenance } from "../../core/evidence/evidence.model";
import { AuthenticationGuard } from "../auth/authentication.guard";

type AuthenticatedRequest = { context?: RequestContext };

function contextOf(request: AuthenticatedRequest): RequestContext {
  if (!request.context?.userId) throw new UnauthorizedException("Authentication required");
  return request.context;
}

type CreateEvidenceBody = {
  provenance: EvidenceProvenance;
  observedAt: string;
  acceptedAt: string;
  confidence: number | null;
};

type AppendLifecycleVersionBody = {
  expectedVersion: number;
  lifecycle: EvidenceLifecycle;
};

@Controller("evidence")
@UseGuards(AuthenticationGuard)
export class EvidenceController {
  constructor(private readonly evidence: EvidenceUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateEvidenceBody, @Req() request: AuthenticatedRequest) {
    const input: EvidenceCreateInput = {
      provenance: body.provenance,
      observedAt: new Date(body.observedAt),
      acceptedAt: new Date(body.acceptedAt),
      confidence: body.confidence ?? null,
    };
    const result = await this.evidence.create(input, contextOf(request));
    if (!result.ok) throw new BadRequestException(result.error.message);
    return result.value;
  }

  @Get(":id")
  async get(@Param("id") id: string, @Req() request: AuthenticatedRequest) {
    const result = await this.evidence.get(id, contextOf(request));
    if (!result.ok) {
      if (result.error instanceof EvidenceNotFoundError) throw new NotFoundException(result.error.message);
      throw new BadRequestException(result.error.message);
    }
    return result.value;
  }

  @Get(":id/versions/:version")
  async getVersion(
    @Param("id") id: string,
    @Param("version", ParseIntPipe) version: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const result = await this.evidence.getVersion(id, version, contextOf(request));
    if (!result.ok) {
      if (result.error instanceof EvidenceNotFoundError) throw new NotFoundException(result.error.message);
      throw new BadRequestException(result.error.message);
    }
    return result.value;
  }

  @Post(":id/versions")
  @HttpCode(HttpStatus.CREATED)
  async appendVersion(
    @Param("id") id: string,
    @Body() body: AppendLifecycleVersionBody,
    @Req() request: AuthenticatedRequest,
  ) {
    const result = await this.evidence.appendLifecycleVersion(
      { evidenceId: id, expectedVersion: body.expectedVersion, lifecycle: body.lifecycle },
      contextOf(request),
    );
    if (!result.ok) {
      if (result.error instanceof EvidenceConflictError) throw new ConflictException(result.error.message);
      throw new BadRequestException(result.error.message);
    }
    return result.value;
  }
}
