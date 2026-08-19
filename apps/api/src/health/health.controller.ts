import { Controller, Get } from '@nestjs/common';

interface HealthResponse {
  status: 'ok';
  service: 'decivexa-api';
  architectureBaseline: 'DECIVEXA-ARCH-FREEZE-001';
}

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return {
      status: 'ok',
      service: 'decivexa-api',
      architectureBaseline: 'DECIVEXA-ARCH-FREEZE-001',
    };
  }
}
