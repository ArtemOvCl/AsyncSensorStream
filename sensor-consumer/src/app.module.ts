import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorClientService } from './sensor-client/sensor-client.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SensorClientService],
})
export class AppModule {}
