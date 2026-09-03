import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PersonalIntelligenceModule as PersonalIntelligenceApplicationModule } from "../../application/personal-intelligence/personal-intelligence.module";
import { PersonalIntelligenceController } from "./personal-intelligence.controller";

// Personal Intelligence Claim Visibility - V1 (Founder Implementation
// Authorization). Reuses the existing PersonalIntelligenceClaimUseCase
// provider from the already-established application/personal-intelligence
// module unchanged - no new repository binding, no duplicate provider,
// no modification to that module's existing wiring. This module adds
// only HTTP exposure (AuthModule + the new controller), mirroring how
// infrastructure/evidence/evidence.module.ts and
// infrastructure/personal-state/personal-state.module.ts each add a
// controller alongside their domain's existing providers.
@Module({
  imports: [PersonalIntelligenceApplicationModule, AuthModule],
  controllers: [PersonalIntelligenceController],
})
export class PersonalIntelligenceHttpModule {}
