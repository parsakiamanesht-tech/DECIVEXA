import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { PersistenceService } from './persistence/persistence.service';

@Module({
  controllers: [HealthController],
  providers: [PersistenceService],
  exports: [PersistenceService],
})
export class AppModule {}
