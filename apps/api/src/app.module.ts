import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PersistenceService } from './persistence/persistence.service';
import { ApplicationModule } from './application/application.module';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { PersonalStateModule } from './infrastructure/personal-state/personal-state.module';
import { EvidenceModule } from './infrastructure/evidence/evidence.module';

@Module({
  imports: [ApplicationModule.register([PersistenceModule]), AuthModule, PersonalStateModule, EvidenceModule],
  controllers: [HealthController],
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class AppModule {}
