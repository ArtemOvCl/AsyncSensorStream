import { OnGatewayInit, WebSocketGateway, WebSocketServer, OnGatewayConnection } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { interval, Observable } from "rxjs";
import { tap, share } from "rxjs/operators";

import { SensorService } from "./sensor-generator.service";

import { SENSOR_DATA_EVENT } from "@shared/types/sensor-data";

@WebSocketGateway(3001)
export class SensorGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private temperature$: Observable<number>;
  private humidity$: Observable<number>;

  constructor(private readonly sensorService: SensorService) {}

  afterInit() {

    this.temperature$ = interval(2000).pipe(
      tap(() => {
        console.log('Temperature Observable!');

        const data = this.sensorService.generateTemperatureData();
        data.forEach(sensorData => this.server.emit(SENSOR_DATA_EVENT, sensorData));
      }),
      share() 
    );

    this.humidity$ = interval(2500).pipe(
      tap(() => {
        console.log('Humidity Observable!');

        const data = this.sensorService.generateHumidityData();
        data.forEach(sensorData => this.server.emit(SENSOR_DATA_EVENT, sensorData));
      }),
      share()
    );

  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id} sufescribing to Observables`);

    this.temperature$.subscribe();
    this.humidity$.subscribe();
  }
}
