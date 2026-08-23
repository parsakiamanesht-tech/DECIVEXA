import type { PersonalIntelligenceClaim } from "./personal-intelligence-claim.model";

export type PersonalIntelligenceAccessAction = "read" | "write";

export function canAccessPersonalIntelligenceClaim(
  actorId: string,
  claim: Pick<PersonalIntelligenceClaim, "userId">,
  action: PersonalIntelligenceAccessAction,
): boolean {
  if (action !== "read" && action !== "write") {
    return false;
  }

  return actorId === claim.userId;
}

export function assertPersonalIntelligenceClaimAccess(
  actorId: string,
  claim: Pick<PersonalIntelligenceClaim, "userId">,
  action: PersonalIntelligenceAccessAction,
): void {
  if (!canAccessPersonalIntelligenceClaim(actorId, claim, action)) {
    throw new Error("Personal Intelligence claim access denied");
  }
}
