import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PersistenceService } from './persistence/persistence.service';
import { PersistenceModule } from './infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [HealthController],
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class AppModule {}
