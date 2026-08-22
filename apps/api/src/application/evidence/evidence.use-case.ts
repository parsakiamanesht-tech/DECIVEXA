import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import type { RequestContext } from "../../context/request-context";
import type { EvidenceLifecycle, EvidenceProvenance, EvidenceVersion } from "../../core/evidence/evidence.model";
import { EVIDENCE_REPOSITORY } from "../../core/evidence/evidence.repository.token";
import type { EvidenceRepository } from "../../core/evidence/evidence.repository";
import { failure, success, type Result } from "../../shared/result/result";

export type EvidenceCreateInput = Readonly<{
  provenance: EvidenceProvenance;
  observedAt: Date;
  acceptedAt: Date;
  confidence: number | null;
}>;

export type EvidenceLifecycleAppendInput = Readonly<{
  evidenceId: string;
  expectedVersion: number;
  lifecycle: EvidenceLifecycle;
}>;

export class EvidenceValidationError extends Error {}
export class EvidenceConflictError extends Error {}

@Injectable()
export class EvidenceUseCase {
  constructor(@Inject(EVIDENCE_REPOSITORY) private readonly repository: EvidenceRepository) {}

  async create(input: EvidenceCreateInput, context: RequestContext): Promise<Result<EvidenceVersion>> {
    if (!context.userId) return failure(new EvidenceValidationError("Authenticated user required"));
    try {
      const version = await this.repository.create({
        evidenceId: randomUUID(),
        versionId: randomUUID(),
        userId: context.userId,
        provenance: input.provenance,
        observedAt: input.observedAt,
        acceptedAt: input.acceptedAt,
        confidence: input.confidence,
        now: new Date(),
      });
      return success(version);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error("Invalid evidence"));
    }
  }

  async appendLifecycleVersion(
    input: EvidenceLifecycleAppendInput,
    context: RequestContext,
  ): Promise<Result<EvidenceVersion>> {
    if (!context.userId) return failure(new EvidenceValidationError("Authenticated user required"));
    if (!Number.isInteger(input.expectedVersion) || input.expectedVersion < 1) {
      return failure(new EvidenceValidationError("Invalid expectedVersion"));
    }
    try {
      const version = await this.repository.appendLifecycleVersion({
        userId: context.userId,
        evidenceId: input.evidenceId,
        versionId: randomUUID(),
        expectedVersion: input.expectedVersion,
        lifecycle: input.lifecycle,
        now: new Date(),
      });
      if (!version) return failure(new EvidenceConflictError("Version conflict or evidence not found"));
      return success(version);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error("Invalid evidence lifecycle transition"));
    }
  }
}
