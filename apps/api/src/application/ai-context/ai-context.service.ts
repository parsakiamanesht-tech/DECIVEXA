import { Injectable } from "@nestjs/common";
import { failure, success, type Result } from "../../shared/result/result";
import { MemoryUseCase } from "../memory/memory.use-case";
import { EvidenceUseCase } from "../evidence/evidence.use-case";
import { PersonalIntelligenceClaimUseCase } from "../personal-intelligence/personal-intelligence-claim.use-case";
import { PersonalStateUseCase } from "../personal-state/personal-state.use-case";
import { AIContextNotFoundError, AIContextUnauthorizedError, AIContextUnknownSourceError } from "./ai-context.errors";
import type { AIContextRequest, AIContextResponse } from "./ai-context.types";

// Application-owned AI Context Boundary (Context Boundary Compatibility
// Remediation increment).
//
// This is the sanctioned mechanism through which a future AIRuntime
// (infrastructure/ai/) may eventually obtain authorized context from
// Memory/Evidence/Personal Intelligence/Personal State - per the
// Founder's "Context Engine Boundary Ownership & Consumption Shape"
// decision. It is NOT wired to AIRuntime in this increment (that
// requires separate Founder authorization) and performs no sensitivity/
// privacy classification, minimization, context budgeting, policy, or
// risk evaluation - all deferred (see ai-context.types.ts).
//
// It dispatches to each existing application use-case's own read-side
// API, unmodified, and forwards RequestContext unchanged. For Memory,
// Evidence, and Personal State, the underlying use-case already enforces
// "authenticated user required" internally and returns a typed
// Result<T> failure if not - this service never duplicates that check,
// it only forwards the Result. Personal Intelligence is the one
// exception: PersonalIntelligenceClaimUseCase performs no authentication
// check of its own, so this service performs the equivalent guard
// itself, mirroring (never duplicating) the same invariant the other
// three use-cases already enforce.
@Injectable()
export class AIContextService {
  constructor(
    private readonly memoryUseCase: MemoryUseCase,
    private readonly evidenceUseCase: EvidenceUseCase,
    private readonly personalIntelligenceClaimUseCase: PersonalIntelligenceClaimUseCase,
    private readonly personalStateUseCase: PersonalStateUseCase,
  ) {}

  async request(input: AIContextRequest): Promise<Result<AIContextResponse>> {
    switch (input.source) {
      case "memory":
        return this.requestMemory(input);
      case "evidence":
        return this.requestEvidence(input);
      case "personal-state":
        return this.requestPersonalState(input);
      case "personal-intelligence":
        return this.requestPersonalIntelligence(input);
      default: {
        const exhaustive: never = input.source;
        return failure(new AIContextUnknownSourceError(`Unknown AI context source: ${String(exhaustive)}`));
      }
    }
  }

  private async requestMemory(input: AIContextRequest): Promise<Result<AIContextResponse>> {
    const result = await this.memoryUseCase.get(input.recordId, input.context);
    if (!result.ok) return failure(result.error);
    return success(toResponse(input, result.value));
  }

  private async requestEvidence(input: AIContextRequest): Promise<Result<AIContextResponse>> {
    const result = await this.evidenceUseCase.get(input.recordId, input.context);
    if (!result.ok) return failure(result.error);
    return success(toResponse(input, result.value));
  }

  private async requestPersonalState(input: AIContextRequest): Promise<Result<AIContextResponse>> {
    // PersonalState has no distinct per-record identity - it is a single
    // current state per authenticated user - so `recordId` is part of
    // the uniform request shape but unused here, matching
    // PersonalStateUseCase's own existing API rather than inventing an
    // artificial record identity for it.
    const result = await this.personalStateUseCase.get(input.context);
    if (!result.ok) return failure(result.error);
    return success(toResponse(input, result.value));
  }

  private async requestPersonalIntelligence(input: AIContextRequest): Promise<Result<AIContextResponse>> {
    // MANDATORY SECURITY INVARIANT: missing context.userId must never
    // reach findClaimForUser(). This check runs first, unconditionally,
    // before any use-case or repository method is called.
    if (!input.context.userId) {
      return failure(new AIContextUnauthorizedError("Authenticated user required"));
    }
    const claim = await this.personalIntelligenceClaimUseCase.findClaimForUser(
      input.context.userId,
      input.recordId,
    );
    if (!claim) {
      return failure(new AIContextNotFoundError("Personal Intelligence claim not found"));
    }
    return success(toResponse(input, claim));
  }
}

function toResponse(input: AIContextRequest, data: unknown): AIContextResponse {
  return { source: input.source, recordId: input.recordId, data };
}
