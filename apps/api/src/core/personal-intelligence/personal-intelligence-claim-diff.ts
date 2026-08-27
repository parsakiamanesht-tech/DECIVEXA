import type { PersonalIntelligenceClaimVersion } from "./personal-intelligence-claim.model";

// Pure, deterministic diff between two versions of the same
// PersonalIntelligenceClaim (IMPLEMENTATION_INCREMENT_PIC-D4-01,
// docs/gates/PERSONAL-INTELLIGENCE-D4-01-CONTRACT-AND-BUILD-AUTHORIZATION-RECORD.md).
// No I/O, no AI, no inference: every reported field is grounded in a
// direct comparison of the two supplied, already-persisted version
// objects. Never fabricates a cause, an interpretation, or a changed
// field that did not actually change - a field only ever appears in
// `changedFields` because it was compared and found unequal.
export type ClaimVersionDiffField =
  | "lifecycle"
  | "provenance"
  | "valueKind"
  | "valueText"
  | "confidence"
  | "evidenceVersionId"
  | "observedAt"
  | "acceptedAt"
  | "createdAt";

export type ClaimVersionExplanation = Readonly<{
  claimId: string;
  fromVersion: PersonalIntelligenceClaimVersion;
  toVersion: PersonalIntelligenceClaimVersion;
  changedFields: readonly ClaimVersionDiffField[];
}>;

export function diffClaimVersions(
  from: PersonalIntelligenceClaimVersion,
  to: PersonalIntelligenceClaimVersion,
): ClaimVersionExplanation {
  const changedFields: ClaimVersionDiffField[] = [];

  if (from.lifecycle !== to.lifecycle) changedFields.push("lifecycle");
  if (from.provenance !== to.provenance) changedFields.push("provenance");
  if (from.valueKind !== to.valueKind) changedFields.push("valueKind");
  if (from.valueText !== to.valueText) changedFields.push("valueText");
  if (from.confidence !== to.confidence) changedFields.push("confidence");
  if (from.evidenceVersionId !== to.evidenceVersionId) changedFields.push("evidenceVersionId");
  if (from.observedAt.getTime() !== to.observedAt.getTime()) changedFields.push("observedAt");
  if (from.acceptedAt.getTime() !== to.acceptedAt.getTime()) changedFields.push("acceptedAt");
  if (from.createdAt.getTime() !== to.createdAt.getTime()) changedFields.push("createdAt");

  return {
    claimId: to.claimId,
    fromVersion: from,
    toVersion: to,
    changedFields,
  };
}
