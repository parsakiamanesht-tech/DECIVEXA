import { Inject, Injectable } from "@nestjs/common";
import { PERSONAL_INTELLIGENCE_INFERENCE_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-inference.repository.token";
import type {
  CreateInferenceInput,
  PersonalIntelligenceInferenceRepository,
  TransitionInferenceLifecycleInput,
} from "../../core/personal-intelligence/personal-intelligence-inference.repository";
import type {
  PersonalIntelligenceInference,
  PersonalIntelligenceInferenceLifecycleEvent,
  PersonalIntelligenceInferenceStatus,
} from "../../core/personal-intelligence/personal-intelligence-inference.model";
import { deriveEffectiveStatus } from "../../core/personal-intelligence/personal-intelligence-inference.model";

// D3 Inference Provenance (docs/gates/PERSONAL-INTELLIGENCE-D3-IMPLEMENTATION-CONTRACT.md).
// Pure delegation to the repository, exactly matching the established
// PersonalIntelligenceClaimUseCase style: all persistence/ownership/
// grounding validation lives in the repository (Contract §G/§I), not
// duplicated here. `getEffectiveStatus` is the one exception - it reads
// lifecycle history via the repository and then applies the pure,
// deterministic `deriveEffectiveStatus` domain function, exactly mirroring
// how explainModelChange (PIC-D4-01) fetches data then applies the pure
// `diffClaimVersions` domain function.
@Injectable()
export class PersonalIntelligenceInferenceUseCase {
  constructor(
    @Inject(PERSONAL_INTELLIGENCE_INFERENCE_REPOSITORY)
    private readonly repository: PersonalIntelligenceInferenceRepository,
  ) {}

  create(input: CreateInferenceInput): Promise<PersonalIntelligenceInference> {
    return this.repository.create(input);
  }

  findInferenceForUser(userId: string, inferenceId: string): Promise<PersonalIntelligenceInference | null> {
    return this.repository.findInferenceForUser(userId, inferenceId);
  }

  findEvidenceReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]> {
    return this.repository.findEvidenceReferencesForUser(userId, inferenceId);
  }

  findClaimContextReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]> {
    return this.repository.findClaimContextReferencesForUser(userId, inferenceId);
  }

  findLifecycleHistoryForUser(
    userId: string,
    inferenceId: string,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent[]> {
    return this.repository.findLifecycleHistoryForUser(userId, inferenceId);
  }

  // Read-only, deterministic. Never mutates, never caches, never
  // materializes a status column - recomputed from lifecycle history on
  // every call (Contract §F "Effective status derivation", §E/§Q
  // prohibition on a cached/materialized status field).
  async getEffectiveStatus(
    userId: string,
    inferenceId: string,
  ): Promise<PersonalIntelligenceInferenceStatus | null> {
    const events = await this.repository.findLifecycleHistoryForUser(userId, inferenceId);
    return deriveEffectiveStatus(events);
  }

  // Appends exactly one new, externally-authorized lifecycle transition.
  // This method decides nothing about *when* a transition should happen -
  // it is a bounded write capability only (Contract §D item 4/§J); no
  // upstream trigger, UI flow, or automated policy is implemented or
  // implied here.
  transitionLifecycle(
    input: TransitionInferenceLifecycleInput,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent | null> {
    return this.repository.transitionLifecycle(input);
  }
}
