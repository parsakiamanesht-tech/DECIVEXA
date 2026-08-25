import { BadRequestException, Controller, Get, Req, ServiceUnavailableException, UnauthorizedException, UseGuards } from "@nestjs/common";
import type { RequestContext } from "../../../context/request-context";
import { AuthenticationGuard } from "../../auth/authentication.guard";
import { AIRuntime } from "./ai-runtime";
import { ContextResolutionFailedError, InvalidAITaskRequestError, UnsupportedContextCardinalityError } from "./runtime.errors";
import { IneligibleCapabilityError, UnknownCapabilityError } from "../capability/capability.errors";
import { NoEligibleCandidateError } from "../router/router.errors";
import { PERSONAL_STATE_INTERPRET_CAPABILITY } from "../capability/personal-state-interpret.capability";

type AuthenticatedRequest = { context?: RequestContext };

function contextOf(request: AuthenticatedRequest): RequestContext {
  if (!request.context?.userId) throw new UnauthorizedException("Authentication required");
  return request.context;
}

// AI Infrastructure / AIRuntime Production-Wiring Validation
// (Founder Authorization: "AI INFRASTRUCTURE / AIRUNTIME PRODUCTION-WIRING
// VALIDATION - PERSONAL STATE - ROUTE-ONLY").
//
// This is the dedicated AI-facing invocation surface required by that
// authorization - deliberately separate from PersonalStateController
// (../../personal-state/personal-state.controller.ts), which remains
// completely unmodified and represents deterministic Personal State
// domain CRUD only.
//
// This controller calls AIRuntime.route() ONLY. It NEVER calls
// AIRuntime.execute(), never imports or invokes any AIProvider/adapter,
// and never generates AI output. Every response below is an
// infrastructure/routing result, not a product-facing AI capability
// result (Founder Authorization §15 governance label).
//
// No model/provider registration is authorized under this increment
// (Founder Authorization §7-9) - CANDIDATE_MODEL_IDS below is a
// placeholder that will not match any registered model, so a real
// request correctly and honestly surfaces NoEligibleCandidateError
// (mapped to 503 below) until a future, separately authorized increment
// registers an approved model/provider. This is expected, correct
// behavior for an infrastructure-validation-only increment - never
// worked around, never faked.
const CANDIDATE_MODEL_IDS: readonly string[] = ["decivexa-infra-validation-placeholder-model"];

@Controller("ai/personal-state")
@UseGuards(AuthenticationGuard)
export class AIRuntimeController {
  constructor(private readonly aiRuntime: AIRuntime) {}

  @Get("interpret/route")
  async routeInterpret(@Req() request: AuthenticatedRequest) {
    const context = contextOf(request);

    try {
      const routing = await this.aiRuntime.route({
        capabilityId: PERSONAL_STATE_INTERPRET_CAPABILITY.capabilityId,
        candidateModelIds: CANDIDATE_MODEL_IDS,
        context,
      });

      return {
        capabilityId: PERSONAL_STATE_INTERPRET_CAPABILITY.capabilityId,
        stage: "routed",
        routing,
        note: "Infrastructure/routing result only. No AI output was generated; AIRuntime.execute() was not invoked.",
      };
    } catch (error) {
      if (error instanceof NoEligibleCandidateError) {
        throw new ServiceUnavailableException(
          "No eligible model/provider is registered for this capability yet. This increment validates infrastructure wiring only; it does not produce AI output.",
        );
      }
      if (
        error instanceof ContextResolutionFailedError ||
        error instanceof UnsupportedContextCardinalityError ||
        error instanceof InvalidAITaskRequestError ||
        error instanceof UnknownCapabilityError ||
        error instanceof IneligibleCapabilityError
      ) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
