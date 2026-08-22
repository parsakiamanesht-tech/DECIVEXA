import { Module } from "@nestjs/common";
import { EVIDENCE_REPOSITORY } from "../../core/evidence/evidence.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { DrizzleEvidenceRepository } from "../persistence/evidence.repository";
import { EvidenceUseCase } from "../../application/evidence/evidence.use-case";
import { EvidenceController } from "./evidence.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [EvidenceController],
  providers: [
    DatabaseService,
    EvidenceUseCase,
    {
      provide: EVIDENCE_REPOSITORY,
      useFactory: (database: DatabaseService) => new DrizzleEvidenceRepository(database.client),
      inject: [DatabaseService],
    },
  ],
})
export class EvidenceModule {}
