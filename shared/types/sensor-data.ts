export interface SensorData {
  sensorId: string;
  temperature: number; // in Celsius
  timestamp: string;
}

export const SENSOR_DATA_EVENT = 'sensorData';