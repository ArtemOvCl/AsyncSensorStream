import { Module } from '@nestjs/common';

import { SensorGateway } from './sensor-generator.gateway';
import { SensorService } from './sensor-generator.service';

@Module({
  providers: [SensorGateway, SensorService],
})
export class SensorModule {}
