import { Module } from "@nestjs/common";
import { WORKSPACE_REPOSITORY } from "../../core/resource/workspace.repository.token";
import { EVIDENCE_REPOSITORY } from "../../core/evidence/evidence.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { DrizzleWorkspaceRepository } from "./workspace.repository";
import { DrizzleEvidenceRepository } from "./evidence.repository";
import { EvidenceUseCase } from "../../application/evidence/evidence.use-case";

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
      provide: EVIDENCE_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzleEvidenceRepository(database.client),
      inject: [DatabaseService],
    },
    EvidenceUseCase,
  ],
  exports: [WORKSPACE_REPOSITORY, EVIDENCE_REPOSITORY, EvidenceUseCase],
})
export class PersistenceModule {}
