import { Injectable } from '@nestjs/common';

import { TemperatureSensorData, HumiditySensorData }  from '@shared/types/sensor-data'

@Injectable()
export class SensorService {
  private sensors = ['S-100', 'S-101', 'S-102', 'S-103', 'S-104', 'S-105', 'S-106', 'S-107', 'S-108', 'S-109'];

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
