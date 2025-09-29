import { Injectable } from '@nestjs/common';

export interface SensorData {
  sensorId: string;
  temperature: number;
  timestamp: string;
}

@Injectable()
export class SensorService {
  private sensors = ['T-100', 'T-101', 'T-102'];

  generateData(): SensorData[] {
    return this.sensors.map(sensorId => ({
      sensorId,
      temperature: +(20 + Math.random() * 10).toFixed(2),
      timestamp: new Date().toISOString(),
    }));
  }
}
