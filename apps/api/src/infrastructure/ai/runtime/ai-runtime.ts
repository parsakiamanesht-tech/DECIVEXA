import type { CapabilityRegistry } from "../capability/capability-registry";
import type { AICapabilityRegistryEntry } from "../capability/capability.types";
import type { ModelRouter } from "../router/model-router";
import type { RoutingRequirements, RoutingResult } from "../router/router.types";
import { AIRuntimeExecutionNotAvailableError, InvalidAITaskRequestError } from "./runtime.errors";
import type { AITaskRequest, NormalizedAITask } from "./runtime.types";

// Routing-only AIRuntime skeleton (Increment 3B).
//
// This is NOT the canonical AIRuntime (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md
// §3; DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §11), which requires 14
// responsibilities including obtaining authorized context, enforcing
// policy, classifying risk, executing, validating output, evaluating
// quality, retry/repair/fallback, and audit/telemetry. None of those
// steps are implemented here: their prerequisite infrastructure
// (ContextEngine, PolicyEngine, RiskEngine, EvaluationService,
// ValidationService) does not exist anywhere in this repository
// (Increment 3 read-only readiness audit §8, §9; conformance audit
// evidence). This class implements only the narrow, honest subset that
// can be computed today without fabricating any of those decisions:
//
//   normalize task shape → resolve capability → derive routing
//   requirements → ModelRouter.select() → return the routing result
//
// A returned RoutingResult means only "a registered model candidate was
// selected according to the currently implemented deterministic routing
// requirements" — never authorization, approval, or a completed
// execution (ADR-007 §7: "AI cannot grant itself permission").
export class AIRuntime {
  constructor(
    private readonly capabilityRegistry: CapabilityRegistry,
    private readonly modelRouter: ModelRouter,
  ) {}

  route(request: AITaskRequest): RoutingResult {
    const task = normalizeTask(request);
    const capability = this.capabilityRegistry.get(task.capabilityId);
    const requirements = deriveRoutingRequirements(capability);
    return this.modelRouter.select(task.candidateModelIds, requirements);
  }

  // Deliberately unimplemented execution boundary (Increment 3B scope
  // limit — Founder Implementation Authorization §11). Crossing from
  // routing into execution requires Context, Policy, Risk, Execution,
  // and Validation infrastructure that does not exist in this repository
  // yet. This method exists so that boundary is explicit and typed
  // rather than silently absent, and it must never be changed to
  // "quietly" proceed with execution — only a future, separately
  // authorized increment may implement it, once its prerequisite
  // infrastructure exists.
  execute(): never {
    throw new AIRuntimeExecutionNotAvailableError(
      "AIRuntime execution is not available: requires Context, Policy, Risk, " +
        "Execution, and Validation infrastructure that is not yet implemented " +
        "or authorized (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md §3 AIRuntime).",
    );
  }
}

// Structural (shape-only) normalization. No natural-language
// interpretation, semantic inference, external-content ingestion, or
// domain reasoning occurs here (Founder Implementation Authorization
// §5).
function normalizeTask(request: AITaskRequest): NormalizedAITask {
  if (typeof request.capabilityId !== "string" || request.capabilityId.length === 0) {
    throw new InvalidAITaskRequestError("AITaskRequest.capabilityId must be a non-empty string");
  }
  if (!Array.isArray(request.candidateModelIds) || request.candidateModelIds.length === 0) {
    throw new InvalidAITaskRequestError("AITaskRequest.candidateModelIds must be a non-empty array");
  }
  return { capabilityId: request.capabilityId, candidateModelIds: request.candidateModelIds };
}

// Derives RoutingRequirements from an AICapabilityRegistryEntry's
// *declared* requirements only. As of this increment,
// AICapabilityRegistrationInput (../capability/capability.types.ts, per
// DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §6) declares no field that
// honestly maps to RoutingRequirements' technical constraints
// (requiredCapabilities / minContextWindow / minMaxOutputTokens — see
// ../router/router.types.ts). Inventing such a mapping was explicitly
// forbidden by the Increment 3 Founder Implementation Authorization §6
// ("If a capability declares something that cannot currently be
// represented honestly by RoutingRequirements, do NOT invent a mapping.
// Keep that metadata declarative/deferred."). The honest result is
// therefore an empty requirements object — every RoutingRequirements
// field is optional, so this asks ModelRouter for no additional
// constraint beyond its own registry-eligibility filtering.
function deriveRoutingRequirements(_capability: AICapabilityRegistryEntry): RoutingRequirements {
  return {};
}
