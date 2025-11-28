import { Injectable, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';

import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import { bufferCount, filter, fromEvent, map, merge, reduce, skip, take } from 'rxjs';

import { TemperatureSensorData, HumiditySensorData, SENSOR_DATA_EVENT } from '@shared/types/sensor-data';

import { convertCelsiusToFahrenheit } from './sensor-client.util';

dotenv.config();

@Injectable()
export class SensorClientService implements OnModuleInit {
  private socket: typeof Socket;

  constructor() {
    const wsUrl = process.env.WEBSOCKET_GATEWAY_URL;

    if (!wsUrl) {
      throw new Error('Error');
    }

    this.socket = io(wsUrl); 
  }

  onModuleInit() {

    const temperature$ = fromEvent<TemperatureSensorData>(this.socket, SENSOR_DATA_EVENT).pipe(
      map(data => ({
        ...data,
        temperature: convertCelsiusToFahrenheit(data.temperature) , 
      })),
      filter(data => data.temperature > 20),
      skip(1), 
      bufferCount(2)
    );
 
    const humidity$ = fromEvent<HumiditySensorData>(this.socket, SENSOR_DATA_EVENT).pipe(
      filter(data => data.humidity > 20),
      take(4),
      reduce(
        (acc, curr) => ({
        sum: acc.sum + curr.humidity,
        count: acc.count + 1
      }),
      { sum: 0, count: 0 }
      ),
      map(acc => acc.sum / acc.count)
    );

    const sensorStream$ = merge(temperature$, humidity$);

    sensorStream$.subscribe({
      next: data => console.log(`Received data: ${JSON.stringify(data)}`),
      error: err => console.error('Error in sensor data stream:', err),
      complete: () => console.log('Sensor data stream completed'),
    });
  }
}