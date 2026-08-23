import { Inject, Injectable } from "@nestjs/common";
import type {
  PersonalIntelligenceClaim,
  PersonalIntelligenceClaimVersion,
} from "../../core/personal-intelligence/personal-intelligence-claim.model";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import type {
  AppendClaimCorrectionInput,
  CreateClaimInput,
  PersonalIntelligenceClaimRepository,
} from "../../core/personal-intelligence/personal-intelligence-claim.repository";

@Injectable()
export class PersonalIntelligenceClaimUseCase {
  constructor(
    @Inject(PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY)
    private readonly repository: PersonalIntelligenceClaimRepository,
  ) {}

  create(input: CreateClaimInput): Promise<PersonalIntelligenceClaimVersion> {
    return this.repository.create(input);
  }

  appendCorrection(
    input: AppendClaimCorrectionInput,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    return this.repository.appendCorrection(input);
  }

  findClaimForUser(userId: string, claimId: string): Promise<PersonalIntelligenceClaim | null> {
    return this.repository.findClaimForUser(userId, claimId);
  }

  findClaimVersionForUser(
    userId: string,
    claimId: string,
    version: number,
  ): Promise<PersonalIntelligenceClaimVersion | null> {
    return this.repository.findClaimVersionForUser(userId, claimId, version);
  }

  findActiveClaimVersionsForUser(userId: string): Promise<PersonalIntelligenceClaimVersion[]> {
    return this.repository.findActiveClaimVersionsForUser(userId);
  }
}
