import {
    HubConnection,
  } from "@microsoft/signalr";
  
  export class SteeringEngine {
    private angle: number;
    private connection: HubConnection| null;
  
    constructor(connection: HubConnection| null) {
      this.angle = 90;
      this.connection = connection;
    }
  
    /**
     * 转向
     * @param angle 角度 50 - 120 默认90
     */
    public async rotate(angle: number) {
      // 控制轮子的运动
      this.angle = angle;
      if (this.connection) {
        await this.connection.invoke("SetServoDirection", this.angle);
      }
    }
  }
  