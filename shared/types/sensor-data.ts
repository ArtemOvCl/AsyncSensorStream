
export interface BaseSensorData {
  sensorId: string;
  timestamp: string;
}

export interface TemperatureSensorData extends BaseSensorData {
  temperature: number;
}

export interface HumiditySensorData extends BaseSensorData {
  humidity: number;
}

export const SENSOR_DATA_EVENT = 'sensorData';
