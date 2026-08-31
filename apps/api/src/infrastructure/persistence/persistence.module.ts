import { Module } from "@nestjs/common";
import { WORKSPACE_REPOSITORY } from "../../core/resource/workspace.repository.token";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import { PERSONAL_INTELLIGENCE_INFERENCE_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-inference.repository.token";
import { PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim-confirmation.repository.token";
import { PERSONAL_INTELLIGENCE_RELATIONSHIP_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-relationship.repository.token";
import { PERSONAL_INTELLIGENCE_RELATIONSHIP_EVIDENCE_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-relationship-evidence.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { DrizzleWorkspaceRepository } from "./workspace.repository";
import { DrizzlePersonalIntelligenceClaimRepository } from "./personal-intelligence-claim.repository";
import { DrizzlePersonalIntelligenceInferenceRepository } from "./personal-intelligence-inference.repository";
import { DrizzlePersonalIntelligenceClaimConfirmationRepository } from "./personal-intelligence-claim-confirmation.repository";
import { DrizzlePersonalIntelligenceRelationshipRepository } from "./personal-intelligence-relationship.repository";
import { DrizzlePersonalIntelligenceRelationshipEvidenceRepository } from "./personal-intelligence-relationship-evidence.repository";

@Module({
  providers: [
    DatabaseService,
    {
      provide: WORKSPACE_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzleWorkspaceRepository(database.client),
      inject: [DatabaseService],
    },
    {
      provide: PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzlePersonalIntelligenceClaimRepository(database.client),
      inject: [DatabaseService],
    },
    {
      provide: PERSONAL_INTELLIGENCE_INFERENCE_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzlePersonalIntelligenceInferenceRepository(database.client),
      inject: [DatabaseService],
    },
    {
      provide: PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzlePersonalIntelligenceClaimConfirmationRepository(database.client),
      inject: [DatabaseService],
    },
    {
      provide: PERSONAL_INTELLIGENCE_RELATIONSHIP_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzlePersonalIntelligenceRelationshipRepository(database.client),
      inject: [DatabaseService],
    },
    {
      provide: PERSONAL_INTELLIGENCE_RELATIONSHIP_EVIDENCE_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzlePersonalIntelligenceRelationshipEvidenceRepository(database.client),
      inject: [DatabaseService],
    },
  ],
  exports: [
    WORKSPACE_REPOSITORY,
    PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY,
    PERSONAL_INTELLIGENCE_INFERENCE_REPOSITORY,
    PERSONAL_INTELLIGENCE_CLAIM_CONFIRMATION_REPOSITORY,
    PERSONAL_INTELLIGENCE_RELATIONSHIP_REPOSITORY,
    PERSONAL_INTELLIGENCE_RELATIONSHIP_EVIDENCE_REPOSITORY,
  ],
})
export class PersistenceModule {}
