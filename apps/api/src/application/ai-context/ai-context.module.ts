import { Module } from "@nestjs/common";
import { MemoryModule } from "../memory/memory.module";
import { EvidenceModule } from "../../infrastructure/evidence/evidence.module";
import { PersonalIntelligenceModule } from "../personal-intelligence/personal-intelligence.module";
import { PersonalStateModule } from "../../infrastructure/personal-state/personal-state.module";
import { AIContextService } from "./ai-context.service";

// Application-owned AI Context Boundary module (Founder decision:
// "Context Engine Boundary Ownership & Consumption Shape"). Exposes
// ONLY AIContextService - never a repository, never a persistence
// adapter, never any internal implementation detail. Not imported by,
// and does not import, infrastructure/ai/ in this increment; not wired
// into AppModule (wiring AIRuntime to AIContextService, and exposing
// this module at the application root, both require separate Founder
// authorization).
@Module({
  imports: [MemoryModule, EvidenceModule, PersonalIntelligenceModule, PersonalStateModule],
  providers: [AIContextService],
  exports: [AIContextService],
})
export class AIContextModule {}
