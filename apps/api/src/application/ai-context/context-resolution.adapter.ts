import { Injectable } from "@nestjs/common";
import {
  AI_RUNTIME_CONTEXT_LABELS,
  type AIRuntimeContextLabel,
  type ContextResolutionPort,
  type ContextResolutionRequest,
  type ContextResolutionResult,
} from "../../infrastructure/ai/runtime/context-resolution.port";
import { AIContextNotFoundError, AIContextUnauthorizedError } from "./ai-context.errors";
import { AIContextService } from "./ai-context.service";
import type { AIContextSource } from "./ai-context.types";
import { EvidenceNotFoundError, EvidenceValidationError } from "../evidence/evidence.use-case";
import { MemoryNotFoundError, MemoryValidationError } from "../memory/memory.use-case";
import { PersonalStateNotFoundError, PersonalStateValidationError } from "../personal-state/personal-state.use-case";

// Application-owned implementation of infrastructure/ai/runtime's
// ContextResolutionPort (Runtime Context Resolution increment; Founder-
// approved Decision 4 — application-owned implementation behind an
// infrastructure-owned port).
//
// This is the ONLY component that translates a capability's declared
// context label + invocation-specific selector into a concrete
// AIContextRequest and calls the existing, unmodified AIContextService.
// It never touches a repository directly, never bypasses
// AIContextService, never duplicates its authorization logic, and never
// fabricates a resolved context when resolution fails — it only
// classifies AIContextService's own already-authoritative outcome into
// this port's discriminated result shape.
@Injectable()
export class ContextResolutionAdapter implements ContextResolutionPort {
  constructor(private readonly aiContextService: AIContextService) {}

  async resolve(request: ContextResolutionRequest): Promise<ContextResolutionResult> {
    if (!isKnownLabel(request.label)) {
      return { status: "unsupported_label", label: request.label };
    }
    const label = request.label;

    // Personal State has no per-record identity (AIContextService itself
    // ignores recordId for this source) — every other source requires a
    // concrete, invocation-specific selector. No data channel in this
    // increment supplies one (see context-resolution.port.ts), so these
    // three sources deterministically fail here rather than guessing or
    // selecting an arbitrary record.
    if (label !== "personal-state" && !request.selector) {
      return { status: "missing_selector", label };
    }

    const result = await this.aiContextService.request({
      context: request.context,
      source: label as AIContextSource,
      recordId: request.selector ?? "",
    });

    if (!result.ok) {
      return classifyFailure(result.error);
    }
    return { status: "resolved", context: { label, data: result.value.data } };
  }
}

function isKnownLabel(label: string): label is AIRuntimeContextLabel {
  return (AI_RUNTIME_CONTEXT_LABELS as readonly string[]).includes(label);
}

// Classifies each source's own already-established typed failure into
// this port's result shape — never re-derives or re-checks authorization
// itself; the classification only reads which error AIContextService (or
// the use-case it delegated to) already produced.
function classifyFailure(error: Error): ContextResolutionResult {
  if (
    error instanceof AIContextUnauthorizedError ||
    error instanceof MemoryValidationError ||
    error instanceof EvidenceValidationError ||
    error instanceof PersonalStateValidationError
  ) {
    // Each of these three use-cases' own "ValidationError" is raised
    // exclusively for a missing context.userId in the read path this
    // adapter exercises — functionally an authorization failure, not an
    // input-shape defect, since the adapter never supplies a malformed
    // recordId/version itself.
    return { status: "unauthorized" };
  }
  if (
    error instanceof AIContextNotFoundError ||
    error instanceof MemoryNotFoundError ||
    error instanceof EvidenceNotFoundError ||
    error instanceof PersonalStateNotFoundError
  ) {
    return { status: "not_found" };
  }
  return { status: "resolution_failure" };
}
