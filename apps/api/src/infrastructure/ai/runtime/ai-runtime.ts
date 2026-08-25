import type { CapabilityRegistry } from "../capability/capability-registry";
import type { AICapabilityRegistryEntry } from "../capability/capability.types";
import type { ModelRouter } from "../router/model-router";
import type { RoutingRequirements, RoutingResult } from "../router/router.types";
import type { ContextResolutionPort } from "./context-resolution.port";
import { authorizePolicy } from "../policy/policy-authorization";
import { PolicyAuthorizationDeniedError } from "../policy/policy.errors";
import {
  AIRuntimeExecutionNotAvailableError,
  ContextResolutionFailedError,
  InvalidAITaskRequestError,
  UnsupportedContextCardinalityError,
} from "./runtime.errors";
import type { AITaskRequest, NormalizedAITask } from "./runtime.types";

// Routing-only AIRuntime skeleton (Increment 3B), extended by the Runtime
// Context Resolution increment and the Policy Authorization / Provider
// Eligibility / Output Validation increment.
//
// This is NOT the canonical AIRuntime (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md
// §3; DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §11), which requires 14
// responsibilities including executing, validating output, evaluating
// quality, retry/repair/fallback, and audit/telemetry. None of those
// remaining steps are implemented here: their prerequisite infrastructure
// (RiskEngine beyond the narrow classification guard already folded into
// Policy Authorization, EvaluationService, a wired ValidationService)
// does not exist. This class implements only the narrow, honest subset
// that can be computed today without fabricating any of those decisions:
//
//   normalize task shape → resolve capability → obtain the capability's
//   (at most one) required context, then minimize it (honest pass-through
//   for Personal State's existing schema) → Policy Authorization (narrow,
//   capability-scoped allow-list — see ../policy/policy-authorization.ts)
//   → derive routing requirements → ModelRouter.select() (also the
//   Provider Eligibility boundary — existing eligible-flag filtering,
//   unmodified) → return the routing result
//
// A returned RoutingResult means only "a registered model candidate was
// selected according to the currently implemented deterministic routing
// requirements, for a request Policy Authorization did not deny" — never
// execution, never AI output (ADR-007 §7: "AI cannot grant itself
// permission").
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
    this.authorizePolicyOrThrow(capability, task.context);
    const requirements = deriveRoutingRequirements(capability);
    // Provider Eligibility boundary: satisfied entirely by ModelRouter's
    // existing, unmodified eligible-flag filtering (ModelRegistry /
    // ProviderRegistry) — no new eligibility check is added here (Founder
    // Implementation Authorization §4: "rely on the existing ModelRouter
    // eligibility filtering"; "DO NOT introduce capability-aware provider
    // eligibility").
    return this.modelRouter.select(task.candidateModelIds, requirements);
  }

  // Narrow Policy Authorization boundary (Founder Implementation
  // Authorization §3): denies deterministically, never silently passes,
  // never fabricates approval. See ../policy/policy-authorization.ts for
  // the pure decision function this delegates to.
  private authorizePolicyOrThrow(capability: AICapabilityRegistryEntry, context: AITaskRequest["context"]): void {
    const decision = authorizePolicy(capability, context);
    if (decision.status === "denied") {
      throw new PolicyAuthorizationDeniedError(`Policy denied capability "${capability.capabilityId}": ${decision.reason}`);
    }
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
    // Context Minimization / Redaction boundary (Founder Implementation
    // Authorization §5): exercised for real on every successful
    // resolution, never silently skipped — see minimizeContext() below
    // for why this is an honest pass-through rather than a generalized
    // minimization subsystem.
    minimizeContext(result.context.data);
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

// Context Minimization / Redaction boundary (Founder Implementation
// Authorization §5): for Personal State's existing schema (timezone /
// locale / availability / provenance / revision / timestamps), no field
// removal is required for this narrow capability — an explicit, honest
// pass-through, not a silently-assumed generalized minimization
// subsystem. No new privacy architecture, no field invention, no
// generalized redaction engine. Exported so it is independently
// unit-testable rather than only reachable indirectly through route().
export function minimizeContext(data: unknown): unknown {
  return data;
}
