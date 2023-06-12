import {
  HubConnection,
} from "@microsoft/signalr";
import { MotorHAT } from "../constant";

export class Wheel {
  private speed: number;
  private num: number;
  private connection: HubConnection | null;
  private isReverse: boolean;

  constructor(connection: HubConnection | null, num: number, isReverse: boolean = false) {
    this.speed = 0;
    this.num = num;
    this.connection = connection;
    this.isReverse = isReverse;
  }

  public async rotate(speed: number) {
    // 控制轮子的运动
    this.speed = speed;
    if (this.connection) {
      await this.connection.invoke("SetDCMotorSpeed", this.num, Math.abs(this.speed));
      if (speed < 0) {
          await this.connection.invoke("SetDCMotorDirection", this.num, this.isReverse ? MotorHAT.BACKWARD: MotorHAT.FORWARD);
      } else if (speed === 0){
          await this.connection.invoke("SetDCMotorDirection", this.num, MotorHAT.RELEASE);
      } else if (speed > 0){
          await this.connection.invoke("SetDCMotorDirection", this.num, this.isReverse ? MotorHAT.FORWARD: MotorHAT.BACKWARD);
      }
    }
  }
}
