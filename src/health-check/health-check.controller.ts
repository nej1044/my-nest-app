import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  TypeOrmHealthIndicator,
  HealthCheckService,
} from '@nestjs/terminus';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }
}
