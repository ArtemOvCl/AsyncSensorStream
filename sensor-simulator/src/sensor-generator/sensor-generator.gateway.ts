import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

import { SensorService } from "./sensor-generator.service";

import { SENSOR_DATA_EVENT } from "@shared/types/sensor-data"

@WebSocketGateway(3001)
export class SensorGateway implements OnGatewayInit{
    @WebSocketServer()
    server: Server;

    constructor(private readonly sensorService: SensorService) {}

    afterInit() {

        setInterval(() => {

            const data = this.sensorService.generateTemperatureData();
            data.forEach(sensorData => {
                this.server.emit(SENSOR_DATA_EVENT, sensorData);
            })
        }, 2000);

        setInterval(() => {

            const data = this.sensorService.generateHumidityData();
            data.forEach(sensorData => {
                this.server.emit(SENSOR_DATA_EVENT, sensorData);
            })
        }, 4000);
        
    }
}