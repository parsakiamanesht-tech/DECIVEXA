import { Module } from "@nestjs/common";
import { PersistenceModule } from "../../infrastructure/persistence/persistence.module";
import { PersonalIntelligenceClaimUseCase } from "./personal-intelligence-claim.use-case";
import { PersonalIntelligenceInferenceUseCase } from "./personal-intelligence-inference.use-case";
import { PersonalIntelligenceClaimConfirmationUseCase } from "./personal-intelligence-claim-confirmation.use-case";
import { PersonalIntelligenceClaimCorrectionUseCase } from "./personal-intelligence-claim-correction.use-case";
import { PersonalIntelligenceEvaluationStandardUseCase } from "./personal-intelligence-evaluation-standard.use-case";
import { PersonalIntelligenceEvaluationUseCase } from "./personal-intelligence-evaluation.use-case";

@Module({
  imports: [PersistenceModule],
  providers: [
    PersonalIntelligenceClaimUseCase,
    PersonalIntelligenceInferenceUseCase,
    PersonalIntelligenceClaimConfirmationUseCase,
    PersonalIntelligenceClaimCorrectionUseCase,
    PersonalIntelligenceEvaluationStandardUseCase,
    PersonalIntelligenceEvaluationUseCase,
  ],
  exports: [
    PersonalIntelligenceClaimUseCase,
    PersonalIntelligenceInferenceUseCase,
    PersonalIntelligenceClaimConfirmationUseCase,
    PersonalIntelligenceClaimCorrectionUseCase,
    PersonalIntelligenceEvaluationStandardUseCase,
    PersonalIntelligenceEvaluationUseCase,
  ],
})
export class PersonalIntelligenceModule {}
