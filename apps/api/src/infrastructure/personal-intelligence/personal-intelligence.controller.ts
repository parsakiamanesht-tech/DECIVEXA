import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { RequestContext } from "../../context/request-context";
import { PersonalIntelligenceClaimUseCase } from "../../application/personal-intelligence/personal-intelligence-claim.use-case";
import { PersonalIntelligenceClaimConfirmationUseCase } from "../../application/personal-intelligence/personal-intelligence-claim-confirmation.use-case";
import type {
  PersonalIntelligenceClaimType,
  PersonalIntelligenceClaimVersion,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import type { PersonalIntelligenceClaimConfirmationAction } from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.model";
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

const CONFIRMATION_ACTIONS: readonly PersonalIntelligenceClaimConfirmationAction[] = [
  "confirmed",
  "unconfirmed",
];

function parseConfirmationAction(value: unknown): PersonalIntelligenceClaimConfirmationAction {
  if (typeof value !== "string" || !CONFIRMATION_ACTIONS.includes(value as PersonalIntelligenceClaimConfirmationAction)) {
    throw new BadRequestException('action must be "confirmed" or "unconfirmed"');
  }
  return value as PersonalIntelligenceClaimConfirmationAction;
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

// C3 Claim Confirm/Unconfirm (Founder Implementation Authorization,
// reconciling docs/gates/PERSONAL-INTELLIGENCE-PIC-CLAIM-ONTOLOGY-
// TAXONOMY-IMPLEMENTATION-INCREMENT-CONTRACT.md §3.3): two additional
// routes below delegate to PersonalIntelligenceClaimConfirmationUseCase
// only. "confirmed" affirms the referenced version's content is
// accurate; "unconfirmed" retracts a prior confirmation - never
// represented as false/wrong/disputed/corrected/invalid. Every valid
// action is a new append-only event; redundant actions are recorded,
// never deduplicated or suppressed. A confirmation may target only the
// claim's current active version - enforced entirely inside the
// use-case, not here and not only in the frontend.
type ConfirmationActionBody = { action: unknown };

@Controller("personal-intelligence")
@UseGuards(AuthenticationGuard)
export class PersonalIntelligenceController {
  constructor(
    private readonly personalIntelligence: PersonalIntelligenceClaimUseCase,
    private readonly confirmation: PersonalIntelligenceClaimConfirmationUseCase,
  ) {}

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

  // GET /personal-intelligence/claims/:claimId/versions/:version/confirmation
  // Read-only. Returns the effective confirmation state derived from
  // existing confirmation events - no new state, metadata, reason,
  // confidence, or score is introduced.
  @Get("claims/:claimId/versions/:version/confirmation")
  async getConfirmation(
    @Param("claimId") claimId: string,
    @Param("version", ParseIntPipe) version: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const context = contextOf(request);
    const result = await this.confirmation.getEffectiveConfirmation(context.userId, claimId, version);
    if (result.status === "claim_version_not_found") throw new NotFoundException("Claim version not found");
    return result;
  }

  // POST /personal-intelligence/claims/:claimId/versions/:version/confirmation
  // Records a new confirmation/unconfirmation event against the claim's
  // current active version only. 409 when the target version exists but
  // is not currently active - the request is well-formed but conflicts
  // with the claim's current state, mirroring PersonalStateController's
  // existing 409-for-state-conflict convention.
  @Post("claims/:claimId/versions/:version/confirmation")
  @HttpCode(HttpStatus.CREATED)
  async recordConfirmation(
    @Param("claimId") claimId: string,
    @Param("version", ParseIntPipe) version: number,
    @Body() body: ConfirmationActionBody,
    @Req() request: AuthenticatedRequest,
  ) {
    const context = contextOf(request);
    const action = parseConfirmationAction(body?.action);
    const result = await this.confirmation.recordAction(context.userId, claimId, version, action);
    if (result.status === "claim_version_not_found") throw new NotFoundException("Claim version not found");
    if (result.status === "not_current_version") {
      throw new ConflictException("This claim version is no longer the current active version");
    }
    return result.event;
  }
}
