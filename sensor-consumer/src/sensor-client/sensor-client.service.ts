import { Injectable, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';

import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import { bufferCount, debounceTime, filter, fromEvent, map, merge, mergeMap, reduce, skip, take } from 'rxjs';

import { TemperatureSensorData, HumiditySensorData, SENSOR_DATA_EVENT } from '@shared/types/sensor-data';

import { convertCelsiusToFahrenheit } from './sensor-client.util';

dotenv.config();

@Injectable()
export class SensorClientService implements OnModuleInit {
  private socket: typeof Socket;

  constructor() {
    const wsUrl = process.env.WEBSOCKET_GATEWAY_URL;

    if (!wsUrl) {
      throw new Error('WEBSOCKET_GATEWAY_URL is not defined in .env');
    }

    this.socket = io(wsUrl); 
  }

  onModuleInit() {
    console.log('Socket client initialized');

    const temperature$ = fromEvent<TemperatureSensorData>(this.socket, SENSOR_DATA_EVENT).pipe(
      map(data => ({
        ...data,
        temperatureF: convertCelsiusToFahrenheit(data.temperature) , 
      })),
      filter(data => data.temperature > 20),
      skip(1),
      bufferCount(2)
    );

    const humidity$ = fromEvent<HumiditySensorData>(this.socket, SENSOR_DATA_EVENT).pipe(
      filter(data => data.humidity > 30),
      take(1),
      debounceTime(500),
      reduce((acc, curr) => acc + curr.humidity, 0)
      //mergeMap(data => [data, { ...data, comfortIndex: data.humidity * 0.8 }])
    );

    const sensorStream$ = merge(temperature$, humidity$);

    sensorStream$.subscribe({
      next: data => console.log(`Received data: ${JSON.stringify(data)}`),
      error: err => console.error('Error in sensor data stream:', err),
      complete: () => console.log('Sensor data stream completed'),
    });
  }
}