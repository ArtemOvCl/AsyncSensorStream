import { Injectable } from '@nestjs/common';

import { TemperatureSensorData, HumiditySensorData }  from '@shared/types/sensor-data'

@Injectable()
export class SensorService {
  private sensors = ['T-100', 'T-101', 'T-102'];

  generateHumidityData(): HumiditySensorData[] {
    return this.sensors.map(sensorId => ({
      sensorId,
      humidity: Math.floor(Math.random() * 101),
      timestamp: new Date().toISOString(),
    }));
  }

  generateTemperatureData(): TemperatureSensorData[] {
    return this.sensors.map(sensorId => ({
      sensorId,
      temperature: this.getRandomTemperature(-10, 40),
      timestamp: new Date().toISOString(),
    }));
  }

  private getRandomTemperature(min: number, max: number): number {
    const value = Math.random() * (max - min) + min;
    return +value.toFixed(2);
  }
}
