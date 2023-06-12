import { Wheel } from "./Wheel";
import { SteeringEngine } from "./SteeringEngine";

export class AckermannWheel {
  private leftFrontWheel: Wheel;
  private rightFrontWheel: Wheel;
  private leftBackWheel: Wheel;
  private rightBackWheel: Wheel;
  private steeringEngine: SteeringEngine;

  constructor(
    lfWheel: Wheel,
    rfWheel: Wheel,
    lbWheel: Wheel,
    rbWheel: Wheel,
    steeringEngine: SteeringEngine
  ) {
    this.leftFrontWheel = lfWheel;
    this.rightFrontWheel = rfWheel;
    this.leftBackWheel = lbWheel;
    this.rightBackWheel = rbWheel;
    this.steeringEngine = steeringEngine;
  }

  public async init() {
    await this.leftFrontWheel.rotate(0);
    await this.rightFrontWheel.rotate(0);
    await this.leftBackWheel.rotate(0);
    await this.rightBackWheel.rotate(0);
    await this.rotate(90);
  }

  /**
   * 直线向前移动
   * @param speed 速度 0停 >0前进 <0后退
   */
  public async move(speed: number) {
    await Promise.all([
      this.leftFrontWheel.rotate(speed),
      this.rightFrontWheel.rotate(speed),
      this.leftBackWheel.rotate(speed),
      this.rightBackWheel.rotate(speed),
    ]);
  }

  /**
   * 左右转向
   * @param angle 角度
   */
  public async rotate(angle: number) {
    await this.steeringEngine.rotate(angle);
  }

  /**
   * 测试
   */
  public async test() {
    const waitSeconds = (seconds: number) => {
      return new Promise(function (resolve) {
        setTimeout(resolve, seconds * 1000);
      });
    };

    await this.leftFrontWheel.rotate(20);
    await waitSeconds(1);
    await this.leftFrontWheel.rotate(0);
    await this.rightFrontWheel.rotate(20);
    await waitSeconds(1);
    await this.rightFrontWheel.rotate(0);
    await this.leftBackWheel.rotate(20);
    await waitSeconds(1);
    await this.leftBackWheel.rotate(0);
    await this.rightBackWheel.rotate(20);
    await waitSeconds(1);
    await this.rightBackWheel.rotate(0);
    await this.rotate(60);
    await waitSeconds(1);
    await this.rotate(90);
    await waitSeconds(1);
    await this.rotate(120);
    await waitSeconds(1);
    await this.rotate(90);
  }
}
