import { Module } from "@nestjs/common";
import { MemoryModule } from "../memory/memory.module";
import { EvidenceModule } from "../../infrastructure/evidence/evidence.module";
import { PersonalIntelligenceModule } from "../personal-intelligence/personal-intelligence.module";
import { PersonalStateModule } from "../../infrastructure/personal-state/personal-state.module";
import { CONTEXT_RESOLUTION_PORT } from "../../infrastructure/ai/runtime/context-resolution.port";
import { AIContextService } from "./ai-context.service";
import { ContextResolutionAdapter } from "./context-resolution.adapter";

// Application-owned AI Context Boundary module (Founder decision:
// "Context Engine Boundary Ownership & Consumption Shape"). Exposes
// AIContextService and, as of the Runtime Context Resolution increment,
// the application-owned implementation of infrastructure/ai/runtime's
// ContextResolutionPort - never a repository, never a persistence
// adapter, never any internal implementation detail. Not imported by
// infrastructure/ai/ (only the port's type/token is imported here, in
// the sanctioned implementer→interface direction); not wired into
// AppModule's real DI composition of AIRuntime (no such composition
// exists yet in this increment - see the implementation report).
@Module({
  imports: [MemoryModule, EvidenceModule, PersonalIntelligenceModule, PersonalStateModule],
  providers: [AIContextService, ContextResolutionAdapter, { provide: CONTEXT_RESOLUTION_PORT, useExisting: ContextResolutionAdapter }],
  exports: [AIContextService, CONTEXT_RESOLUTION_PORT],
})
export class AIContextModule {}
