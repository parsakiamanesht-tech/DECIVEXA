import { Module } from "@nestjs/common";
import { WORKSPACE_REPOSITORY } from "../../core/resource/workspace.repository.token";
import { PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY } from "../../core/personal-intelligence/personal-intelligence-claim.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { DrizzleWorkspaceRepository } from "./workspace.repository";
import { DrizzlePersonalIntelligenceClaimRepository } from "./personal-intelligence-claim.repository";

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
  ],
  exports: [WORKSPACE_REPOSITORY, PERSONAL_INTELLIGENCE_CLAIM_REPOSITORY],
})
export class PersistenceModule {}
