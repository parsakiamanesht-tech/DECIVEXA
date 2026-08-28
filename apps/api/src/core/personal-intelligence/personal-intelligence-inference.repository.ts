import type { PersonalIntelligenceClaimType, PersonalIntelligenceValueKind } from "./personal-intelligence-claim.model";
import type {
  PersonalIntelligenceInference,
  PersonalIntelligenceInferenceLifecycleEvent,
  PersonalIntelligenceInferenceStatus,
  PersonalIntelligenceInferenceTerminalStatus,
} from "./personal-intelligence-inference.model";

export type CreateInferenceInput = Readonly<{
  inferenceId: string;
  userId: string;
  claimType: PersonalIntelligenceClaimType;
  valueKind: PersonalIntelligenceValueKind;
  valueText: string;
  generatedAt: Date;
  producerCapabilityId: string;
  producerCapabilityVersion: string;
  producerProviderId: string;
  producerModelId: string;
  modelReportedConfidence: number | null;
  systemAdjustedConfidence: number | null;
  // Invariant 4: must contain at least one entry. The repository rejects
  // (before persisting anything) if this is empty, or if any entry does
  // not resolve to an EvidenceVersion owned by `userId`.
  evidenceVersionIds: readonly string[];
  // Optional ClaimVersion contextual grounding (may be empty). Never
  // counted toward the Invariant-4 minimum.
  claimContextIds: readonly string[];
  initialLifecycleEventId: string;
  now: Date;
}>;

export type TransitionInferenceLifecycleInput = Readonly<{
  lifecycleEventId: string;
  userId: string;
  inferenceId: string;
  expectedFromStatus: PersonalIntelligenceInferenceStatus;
  toStatus: PersonalIntelligenceInferenceTerminalStatus;
  transitionedAt: Date;
  now: Date;
}>;

export interface PersonalIntelligenceInferenceRepository {
  create(input: CreateInferenceInput): Promise<PersonalIntelligenceInference>;
  findInferenceForUser(userId: string, inferenceId: string): Promise<PersonalIntelligenceInference | null>;
  findEvidenceReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]>;
  findClaimContextReferencesForUser(userId: string, inferenceId: string): Promise<readonly string[]>;
  findLifecycleHistoryForUser(
    userId: string,
    inferenceId: string,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent[]>;
  // Appends exactly one new lifecycle-history entry, atomically, subject
  // to the concurrency guard described in Contract §I (mirrors
  // appendCorrection/appendLifecycleVersion): returns null, never an
  // error, when the transition cannot be applied because the caller's
  // `expectedFromStatus` no longer matches the inference's current
  // effective status (concurrent transition, stale observation), the
  // inference does not exist or is not owned by `userId`, or
  // `expectedFromStatus` is not `"proposed"` (the fixed transition graph
  // — Contract §F — permits no transition out of a terminal state).
  transitionLifecycle(
    input: TransitionInferenceLifecycleInput,
  ): Promise<PersonalIntelligenceInferenceLifecycleEvent | null>;
}
