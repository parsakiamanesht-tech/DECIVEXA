import type { RequestContext } from "../../context/request-context";

// Application-owned AI Context Boundary contracts (Context Boundary
// Compatibility Remediation increment).
//
// Deliberately narrow: no purpose, sensitivity ceiling, privacy
// classification, temporal scope, context budget, evidence
// requirements, provider target, model target, risk classification, or
// policy fields - all explicitly deferred to separately-gated future
// work (Founder Implementation Authorization "Context Boundary
// Skeleton" §5, §6).
export type AIContextSource = "memory" | "evidence" | "personal-intelligence" | "personal-state";

// `RequestContext` is reused exactly, never redefined.
export interface AIContextRequest {
  readonly context: RequestContext;
  readonly source: AIContextSource;
  readonly recordId: string;
}

// `data` intentionally carries the underlying application use-case's own
// DTO unmodified (never a raw ORM/Drizzle row, never a newly-invented
// domain representation, never a cross-domain union type - each source
// keeps its own native shape; only this envelope is uniform).
export interface AIContextResponse {
  readonly source: AIContextSource;
  readonly recordId: string;
  readonly data: unknown;
}
