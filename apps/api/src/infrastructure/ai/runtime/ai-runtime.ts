import type { CapabilityRegistry } from "../capability/capability-registry";
import type { AICapabilityRegistryEntry } from "../capability/capability.types";
import type { ModelRouter } from "../router/model-router";
import type { RoutingRequirements, RoutingResult } from "../router/router.types";
import type { ContextResolutionPort } from "./context-resolution.port";
import {
  AIRuntimeExecutionNotAvailableError,
  ContextResolutionFailedError,
  InvalidAITaskRequestError,
  UnsupportedContextCardinalityError,
} from "./runtime.errors";
import type { AITaskRequest, NormalizedAITask } from "./runtime.types";

// Routing-only AIRuntime skeleton (Increment 3B), extended with a single
// declaratively-required context-acquisition step (Runtime Context
// Resolution increment).
//
// This is NOT the canonical AIRuntime (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md
// §3; DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §11), which requires 14
// responsibilities including enforcing policy, classifying risk,
// executing, validating output, evaluating quality, retry/repair/
// fallback, and audit/telemetry. None of those steps are implemented
// here: their prerequisite infrastructure (PolicyEngine, RiskEngine,
// EvaluationService, ValidationService) does not exist anywhere in this
// repository. This class implements only the narrow, honest subset that
// can be computed today without fabricating any of those decisions:
//
//   normalize task shape → resolve capability → obtain the capability's
//   (at most one) required context → derive routing requirements →
//   ModelRouter.select() → return the routing result
//
// A returned RoutingResult means only "a registered model candidate was
// selected according to the currently implemented deterministic routing
// requirements" — never authorization, approval, or a completed
// execution (ADR-007 §7: "AI cannot grant itself permission").
export class AIRuntime {
  constructor(
    private readonly capabilityRegistry: CapabilityRegistry,
    private readonly modelRouter: ModelRouter,
    private readonly contextResolutionPort: ContextResolutionPort,
  ) {}

  async route(request: AITaskRequest): Promise<RoutingResult> {
    const task = normalizeTask(request);
    const capability = this.capabilityRegistry.get(task.capabilityId);
    await this.resolveRequiredContext(capability, task.context);
    const requirements = deriveRoutingRequirements(capability);
    return this.modelRouter.select(task.candidateModelIds, requirements);
  }

  // Zero requiredContext: no acquisition attempted, behavior remains
  // deterministic (Founder Implementation Authorization §11). Exactly
  // one requiredContext: resolved through the port, failing
  // deterministically — never silently, never fabricated — on any
  // non-"resolved" outcome. More than one requiredContext: explicitly
  // unsupported in this increment, never silently narrowed to "process
  // only the first item."
  private async resolveRequiredContext(
    capability: AICapabilityRegistryEntry,
    context: AITaskRequest["context"],
  ): Promise<void> {
    const requiredContext = capability.requiredContext;
    if (requiredContext.length === 0) return;
    if (requiredContext.length > 1) {
      throw new UnsupportedContextCardinalityError(
        `Capability "${capability.capabilityId}" declares ${requiredContext.length} requiredContext items; ` +
          "this increment supports at most one",
      );
    }

    const label = requiredContext[0];
    // Founder Implementation Authorization §2: "the resolver must have a
    // concrete invocation-specific ID available before constructing the
    // AIContextRequest" — no data channel in this increment supplies
    // one, so every call passes `selector: null`. The port itself, not
    // AIRuntime, decides whether the resolved source actually needs a
    // selector (Personal State does not; Memory/Evidence/Personal
    // Intelligence do — see context-resolution.port.ts and its
    // application-side implementation).
    const result = await this.contextResolutionPort.resolve({ context, label, selector: null });
    if (result.status !== "resolved") {
      throw new ContextResolutionFailedError(
        `Context resolution failed for capability "${capability.capabilityId}", label "${label}": ${result.status}`,
      );
    }
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
  return { capabilityId: request.capabilityId, candidateModelIds: request.candidateModelIds, context: request.context };
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
