import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

import { SensorService } from "./sensor-generator.service";

const SENSOR_DATA_EVENT = 'sensorData';

@WebSocketGateway(3001)
export class SensorGateway implements OnGatewayInit{
    @WebSocketServer()
    server: Server;

    constructor(private readonly sensorService: SensorService) {}

    afterInit() {

        setInterval(() => {

            const data = this.sensorService.generateData();
            data.forEach(sensorData => {
                this.server.emit(SENSOR_DATA_EVENT, sensorData);
            })
        }, 2000);
        
    }
}