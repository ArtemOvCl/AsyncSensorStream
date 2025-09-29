import { Injectable, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';

import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import { fromEvent, map } from 'rxjs';

import { SensorData, SENSOR_DATA_EVENT } from '@shared/types/sensor-data';

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

    const sensorStream$ = fromEvent<SensorData>(this.socket, SENSOR_DATA_EVENT);

    sensorStream$.pipe(
        map(data => ({
            ...data, 
            temperatureF: convertCelsiusToFahrenheit(data.temperature)
        }))
    ).subscribe({
        next: data => console.log(`Received data: ${JSON.stringify(data)}`),
        error: err => console.error('Error in sensor data stream:', err),
        complete: () => console.log('Sensor data stream completed'),
    });
  }
}