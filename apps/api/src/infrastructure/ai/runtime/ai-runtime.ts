import type { CapabilityRegistry } from "../capability/capability-registry";
import type { AICapabilityRegistryEntry } from "../capability/capability.types";
import type { ModelRouter } from "../router/model-router";
import type { RoutingRequirements, RoutingResult } from "../router/router.types";
import type { ContextResolutionPort } from "./context-resolution.port";
import type { ProviderResolutionPort } from "./provider-resolution.port";
import type { GenerateRequest, GenerateResult } from "../provider/ai-provider.types";
import { authorizePolicy } from "../policy/policy-authorization";
import { PolicyAuthorizationDeniedError } from "../policy/policy.errors";
import { authorizeOutputPolicy, OutputPolicyValidationDeniedError } from "../policy/output-policy-validation";
import { assertOutputAccepted, validateOutput } from "../validation/output-validation";
import {
  AIRuntimeExecutionNotAvailableError,
  ContextResolutionFailedError,
  InvalidAITaskRequestError,
  ProviderResolutionFailedError,
  UnsupportedContextCardinalityError,
} from "./runtime.errors";
import type { AITaskRequest, NormalizedAITask } from "./runtime.types";

// AIRuntime: routing (Increment 3B), extended by the Runtime Context
// Resolution increment, the Policy Authorization / Provider Eligibility /
// Output Validation increment, and the First Controlled Execution
// increment (Founder Implementation Authorization: "First Controlled
// Execution, Narrow Test-Only Scope").
//
// This is NOT the canonical AIRuntime (DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md
// §3; DECIVEXA_INTELLIGENCE_ARCHITECTURE_V1.md §11): retry/repair/fallback,
// quality evaluation, and audit/telemetry remain unimplemented — their
// prerequisite infrastructure (EvaluationService, an audit pipeline) does
// not exist. execute() now performs a narrow, capability-scoped,
// test-only-provider execution for exactly personal-state.interpret; it
// is not a generalized execution engine and cannot reach any other
// capability or a real provider in this increment.
//
// route()'s pipeline: normalize task shape → resolve capability →
// obtain and minimize the capability's (at most one) required context →
// Policy Authorization (narrow, capability-scoped allow-list — see
// ../policy/policy-authorization.ts) → derive routing requirements →
// ModelRouter.select() (also the Provider Eligibility boundary —
// existing eligible-flag filtering, unmodified) → return the routing
// result. A returned RoutingResult means only "a registered model
// candidate was selected... for a request Policy Authorization did not
// deny" — never execution, never AI output (ADR-007 §7: "AI cannot grant
// itself permission").
//
// execute()'s pipeline additionally resolves an AIProvider instance
// (via ProviderResolutionPort — see ../runtime/provider-resolution.port.ts)
// for the routed providerId, constructs a purely mechanical
// GenerateRequest from the already-minimized context, calls
// AIProvider.generate() (never a concrete adapter class directly), then
// runs the existing structural Output Validation
// (../validation/output-validation.ts, unmodified) followed by a new,
// equally narrow, metadata-only Output Policy Validation
// (../policy/output-policy-validation.ts). providerResolutionPort is the
// constructor's fourth, REQUIRED dependency (Founder Implementation
// Authorization: "Provider Resolution Gate 2b" — closing the previously
// tracked "optional fourth AIRuntime dependency" architectural risk).
// Production wiring (ai-runtime.module.ts, Gate 2a) already supplies a
// real KeyedProviderResolver, backed by an empty, immutable provider
// map, as this argument, so this change requires no modification to
// that file. execute() still cannot successfully invoke any real
// provider in production — not because the dependency is absent, but
// because ModelRouter.select() fails first on the still-empty
// ModelRegistry/ProviderRegistry (Gate 3, not this gate) and, even were
// that bypassed, the resolver's map is still empty. The defensive
// `if (!this.providerResolutionPort)` guard below is retained unmodified
// even though no type-safe caller can now trigger it — removing
// existing runtime behavior is a separate, not-yet-authorized semantic
// change (Gate 2b §4).
export class AIRuntime {
  constructor(
    private readonly capabilityRegistry: CapabilityRegistry,
    private readonly modelRouter: ModelRouter,
    private readonly contextResolutionPort: ContextResolutionPort,
    private readonly providerResolutionPort: ProviderResolutionPort,
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

  // First Controlled Execution (Founder Implementation Authorization
  // §6): the exact 13-stage sequence specified there. Only
  // personal-state.interpret can ever pass Policy Authorization (stage
  // 5) and reach provider.generate() (stage 10) — every other capability
  // id fails at capability resolution (UnknownCapabilityError) or Policy
  // Authorization (PolicyAuthorizationDeniedError), both strictly before
  // any provider is resolved or invoked. No capability-specific branching
  // is added here beyond what authorizePolicy() already enforces.
  async execute(request: AITaskRequest): Promise<GenerateResult> {
    if (!this.providerResolutionPort) {
      throw new AIRuntimeExecutionNotAvailableError(
        "AIRuntime execution is not available: no ProviderResolutionPort was supplied to this AIRuntime instance " +
          "(this constructor argument is required as of Gate 2b; reaching this branch means an AIRuntime instance " +
          "was constructed outside TypeScript's type checking).",
      );
    }

    const task = normalizeTask(request);
    const capability = this.capabilityRegistry.get(task.capabilityId);
    const minimizedContext = await this.resolveRequiredContext(capability, task.context);
    this.authorizePolicyOrThrow(capability, task.context);
    const requirements = deriveRoutingRequirements(capability);
    const routingResult = this.modelRouter.select(task.candidateModelIds, requirements);

    const provider = await this.providerResolutionPort.resolve(routingResult.providerId);
    if (!provider) {
      throw new ProviderResolutionFailedError(`No AIProvider instance resolved for providerId "${routingResult.providerId}"`);
    }

    const generateRequest = buildGenerateRequest(routingResult.modelId, minimizedContext);
    const rawResult = await provider.generate(generateRequest);
    const validated = assertOutputAccepted(validateOutput(rawResult));

    this.authorizeOutputPolicyOrThrow(capability);

    return validated;
  }

  // Metadata-only Output Policy Validation (Founder Implementation
  // Authorization §11): the §6 "Policy Validation" pipeline stage from
  // DECIVEXA_AI_IMPLEMENTATION_CONTRACT_V1.md, applied after structural
  // Output Validation succeeds. See ../policy/output-policy-validation.ts
  // for the pure decision function this delegates to.
  private authorizeOutputPolicyOrThrow(capability: AICapabilityRegistryEntry): void {
    const decision = authorizeOutputPolicy(capability);
    if (decision.status === "denied") {
      throw new OutputPolicyValidationDeniedError(`Output Policy Validation denied capability "${capability.capabilityId}": ${decision.reason}`);
    }
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
  // Returns the minimized context data on success (undefined for a
  // zero-requiredContext capability) so execute() can build a
  // GenerateRequest from it; route() calls this identically and simply
  // discards the return value, exactly as before this increment — its
  // observable behavior is unchanged.
  private async resolveRequiredContext(
    capability: AICapabilityRegistryEntry,
    context: AITaskRequest["context"],
  ): Promise<unknown> {
    const requiredContext = capability.requiredContext;
    if (requiredContext.length === 0) return undefined;
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
    // for why this is a narrow, capability-scoped field whitelist rather
    // than a generalized minimization subsystem.
    return minimizeContext(label, result.context.data);
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
// Authorization "First Controlled Execution, Narrow Test-Only Scope" §5):
// for label === "personal-state", the provider-facing payload MUST
// contain exactly {timezone, locale, availability} — never id, userId,
// revision, provenance, createdAt, or updatedAt. This is a narrow,
// capability-scoped field whitelist, not a generalized
// redaction/minimization subsystem or a change to PersonalState's
// domain type. No other context label is expanded or narrowed by this
// increment — an unmodified pass-through for any other label, exactly
// as before this increment ("No other context type may be expanded").
// Exported so it is independently unit-testable rather than only
// reachable indirectly through route()/execute().
export function minimizeContext(label: string, data: unknown): unknown {
  if (label === "personal-state") {
    const record = isRecord(data) ? data : {};
    return { timezone: record.timezone, locale: record.locale, availability: record.availability };
  }
  return data;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// Purely mechanical transport construction (Founder Implementation
// Authorization §10): one user-role message whose content is the
// minimized context, deterministically JSON-serialized. No system
// prompt, no hidden instructions, no product interpretation logic, no
// prompt-engineering subsystem — this is not a product prompt design.
function buildGenerateRequest(modelId: string, minimizedContext: unknown): GenerateRequest {
  return {
    model: modelId,
    messages: [{ role: "user", content: JSON.stringify(minimizedContext) }],
  };
}
