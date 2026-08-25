import type { RequestContext } from "../../../context/request-context";

// AIRuntime → Context Resolution Port (Runtime Context Resolution
// increment).
//
// Dependency-inversion seam (Founder-approved Model B): infrastructure/ai
// owns and depends only on this interface + token; the implementation is
// provided from application/ai-context (see
// ../../../application/ai-context/context-resolution.adapter.ts). This
// mirrors the repository's existing core/*.repository.token.ts pattern
// (consumer owns the port, an outer layer implements it), one layer up.
// infrastructure/ai never imports application/ai-context directly —
// only this port's type is shared, and only in the sanctioned
// implementer→interface direction.
//
// Structurally precedent-shaped after core/resource/ResourceResolver
// (reference → typed discriminated result, strategy-based resolution) —
// reused as a *pattern* only. core/resource/* is not imported, modified,
// or extended; ResourceType is not touched; no AI context type is
// registered into the existing resource-resolution registry. AI context
// resolution remains a distinct concern from workspace-resource
// resolution.

// Small, closed vocabulary of AI context labels this increment
// recognizes end-to-end — deliberately local to infrastructure/ai/, and
// deliberately NOT the same declared type as
// application/ai-context/ai-context.types.ts's AIContextSource (which is
// not imported or modified here). No "goal-state" or other
// not-yet-real domain concept is included — only the four context
// sources that already exist as real, tested Context Boundary sources.
export const AI_RUNTIME_CONTEXT_LABELS = ["memory", "evidence", "personal-state", "personal-intelligence"] as const;
export type AIRuntimeContextLabel = (typeof AI_RUNTIME_CONTEXT_LABELS)[number];

export interface ContextResolutionRequest {
  readonly context: RequestContext;
  // Raw label exactly as declared on the capability
  // (AICapabilityRegistrationInput.requiredContext[0]). AIRuntime never
  // validates this against AIRuntimeContextLabel itself — only the
  // implementation, which owns dispatch, decides "unsupported_label"
  // below. This keeps AIRuntime agnostic of the vocabulary's members,
  // knowing only that the port exists.
  readonly label: string;
  // Invocation-specific selector (e.g. a concrete record id), per the
  // Founder-approved Decision 2: "resolver-owned selection consuming
  // task-derived invocation data." No data channel in this increment
  // supplies one — AITaskRequest gained exactly `context: RequestContext`
  // and nothing else — so every current call site passes `null`. This is
  // not a defect: it is the honest, narrow-subset result of this
  // increment's authorized scope, exactly as Increment 3B left
  // RoutingRequirements deliberately empty. A future, separately
  // authorized increment that adds a real selector data channel does not
  // require changing this port's contract, only what supplies this
  // field.
  readonly selector: string | null;
}

export interface ResolvedAIRuntimeContext {
  readonly label: AIRuntimeContextLabel;
  // The underlying AIContextResponse's own `data` field, passed through
  // unmodified — never re-shaped, scored, ranked, filtered, or redacted.
  readonly data: unknown;
}

// Discriminated result, deliberately distinguishing every failure this
// increment's Founder Implementation Authorization §12 requires:
// unsupported label, missing selector, not found, unauthorized, and a
// residual resolution failure — never collapsed into a single generic
// failure, and never converted into a fabricated success.
export type ContextResolutionResult =
  | Readonly<{ status: "resolved"; context: ResolvedAIRuntimeContext }>
  | Readonly<{ status: "unsupported_label"; label: string }>
  | Readonly<{ status: "missing_selector"; label: AIRuntimeContextLabel }>
  | Readonly<{ status: "not_found" }>
  | Readonly<{ status: "unauthorized" }>
  | Readonly<{ status: "resolution_failure" }>;

export interface ContextResolutionPort {
  resolve(request: ContextResolutionRequest): Promise<ContextResolutionResult>;
}

export const CONTEXT_RESOLUTION_PORT = Symbol("CONTEXT_RESOLUTION_PORT");
