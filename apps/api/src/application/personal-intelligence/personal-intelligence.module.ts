import { Module } from "@nestjs/common";
import { PersistenceModule } from "../../infrastructure/persistence/persistence.module";
import { PersonalIntelligenceClaimUseCase } from "./personal-intelligence-claim.use-case";

@Module({
  imports: [PersistenceModule],
  providers: [PersonalIntelligenceClaimUseCase],
  exports: [PersonalIntelligenceClaimUseCase],
})
export class PersonalIntelligenceModule {}
