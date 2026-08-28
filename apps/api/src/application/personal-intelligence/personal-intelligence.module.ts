import { Module } from "@nestjs/common";
import { PersistenceModule } from "../../infrastructure/persistence/persistence.module";
import { PersonalIntelligenceClaimUseCase } from "./personal-intelligence-claim.use-case";
import { PersonalIntelligenceInferenceUseCase } from "./personal-intelligence-inference.use-case";

@Module({
  imports: [PersistenceModule],
  providers: [PersonalIntelligenceClaimUseCase, PersonalIntelligenceInferenceUseCase],
  exports: [PersonalIntelligenceClaimUseCase, PersonalIntelligenceInferenceUseCase],
})
export class PersonalIntelligenceModule {}
