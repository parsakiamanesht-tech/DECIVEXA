import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { RequestContext } from "../../context/request-context";
import { PersonalIntelligenceClaimUseCase } from "../../application/personal-intelligence/personal-intelligence-claim.use-case";
import type {
  PersonalIntelligenceClaimType,
  PersonalIntelligenceClaimVersion,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import { AuthenticationGuard } from "../auth/authentication.guard";

type AuthenticatedRequest = { context?: RequestContext };

function contextOf(request: AuthenticatedRequest): RequestContext & { userId: string } {
  if (!request.context?.userId) throw new UnauthorizedException("Authentication required");
  return request.context as RequestContext & { userId: string };
}

function parseOptionalDate(value: string | undefined, field: string): Date | undefined {
  if (value === undefined) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) throw new BadRequestException(`Invalid ${field}`);
  return parsed;
}

function parseVersionQueryParam(value: string | undefined, field: string): number {
  if (value === undefined) throw new BadRequestException(`${field} is required`);
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new BadRequestException(`Invalid ${field}`);
  return parsed;
}

// Personal Intelligence Claim Visibility - V1
// (Founder Implementation Authorization: "PERSONAL INTELLIGENCE CLAIM
// VISIBILITY V1", read-only Product/Implementation Contract; blocker
// resolution: "FOUNDER DECISION - BLOCKER RESOLUTION", authorizing
// findClaimForUser as a fifth read path).
//
// This controller exposes exactly five already-existing, read-only
// PersonalIntelligenceClaimUseCase methods:
//   - findActiveClaimVersionsForUser (merged with claimType below)
//   - findClaimForUser (used only to attach each version's existing
//     claimType - never displayed or used for anything else)
//   - detectChange
//   - explainModelChange
//   - inspectEvidence
// It introduces no new repository method, no new query, no new domain
// logic, no AI, and no write path. Every response is either an
// already-persisted domain object, a mechanical merge of two such
// objects (listActiveClaims), or a direct pass-through of an existing
// use-case result (history/diff/evidence). Mirrors the thin-controller
// shape already established by EvidenceController/PersonalStateController.
type ActiveClaimView = PersonalIntelligenceClaimVersion & {
  claimType: PersonalIntelligenceClaimType | null;
};

@Controller("personal-intelligence")
@UseGuards(AuthenticationGuard)
export class PersonalIntelligenceController {
  constructor(private readonly personalIntelligence: PersonalIntelligenceClaimUseCase) {}

  // GET /personal-intelligence/claims
  // One entry per active claim (findActiveClaimVersionsForUser already
  // returns at most one active version per claim). Each version's
  // existing claimType is attached via findClaimForUser - a merge of two
  // already-existing, already-tested read results, not a new fact. A
  // claim that cannot be resolved (should not occur under the existing
  // ownership invariants) is reported honestly as claimType: null,
  // never fabricated.
  @Get("claims")
  async listActiveClaims(@Req() request: AuthenticatedRequest): Promise<ActiveClaimView[]> {
    const context = contextOf(request);
    const versions = await this.personalIntelligence.findActiveClaimVersionsForUser(context.userId);

    return Promise.all(
      versions.map(async (version) => {
        const claim = await this.personalIntelligence.findClaimForUser(context.userId, version.claimId);
        return { ...version, claimType: claim?.claimType ?? null };
      }),
    );
  }

  // GET /personal-intelligence/history?since=<ISO date>
  // Direct pass-through of detectChange: every version, for every claim,
  // any lifecycle - matching detectChange's actual, unfiltered semantics
  // honestly rather than implying a per-claim scope it does not have.
  // Grouping by claim is a presentation-only transformation left to the
  // client, exactly as findActiveClaimVersionsForUser's own callers
  // already do for the active-claim list.
  @Get("history")
  async history(
    @Query("since") since: string | undefined,
    @Req() request: AuthenticatedRequest,
  ): Promise<PersonalIntelligenceClaimVersion[]> {
    const context = contextOf(request);
    const sinceDate = parseOptionalDate(since, "since");
    return this.personalIntelligence.detectChange(context.userId, sinceDate);
  }

  // GET /personal-intelligence/claims/:claimId/diff?from=<version>&to=<version>
  // Direct pass-through of explainModelChange. A null result (either
  // requested version does not exist for this user) is mapped to 404 -
  // never fabricated into an empty or synthetic explanation.
  @Get("claims/:claimId/diff")
  async diff(
    @Param("claimId") claimId: string,
    @Query("from") from: string | undefined,
    @Query("to") to: string | undefined,
    @Req() request: AuthenticatedRequest,
  ) {
    const context = contextOf(request);
    const fromVersion = parseVersionQueryParam(from, "from");
    const toVersion = parseVersionQueryParam(to, "to");

    const explanation = await this.personalIntelligence.explainModelChange(
      context.userId,
      claimId,
      fromVersion,
      toVersion,
    );
    if (!explanation) throw new NotFoundException("Claim version not found");
    return explanation;
  }

  // GET /personal-intelligence/claims/:claimId/versions/:version/evidence
  // Direct pass-through of inspectEvidence's four discriminated states.
  // "not_linked" and "evidence_missing" are returned as-is (200) - they
  // are legitimate, honest facts about the stored data, not errors.
  // Only "claim_version_not_found" (the requested claim version itself
  // does not exist for this user) is mapped to 404, mirroring the
  // existing EvidenceController not-found convention.
  @Get("claims/:claimId/versions/:version/evidence")
  async evidence(
    @Param("claimId") claimId: string,
    @Param("version", ParseIntPipe) version: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const context = contextOf(request);
    const result = await this.personalIntelligence.inspectEvidence(context.userId, claimId, version);
    if (result.status === "claim_version_not_found") throw new NotFoundException("Claim version not found");
    return result;
  }
}
