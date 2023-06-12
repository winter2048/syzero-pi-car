import { Wheel } from "./Wheel";

export class MecanumWheel {
  private leftFrontWheel: Wheel;
  private rightFrontWheel: Wheel;
  private leftBackWheel: Wheel;
  private rightBackWheel: Wheel;

  constructor(lfWheel: Wheel, rfWheel: Wheel, lbWheel: Wheel, rbWheel: Wheel) {
    this.leftFrontWheel = lfWheel;
    this.rightFrontWheel = rfWheel;
    this.leftBackWheel = lbWheel;
    this.rightBackWheel = rbWheel;
  }

    /**
   * 停止
   */
    stop() {
      this.leftFrontWheel.rotate(0);
      this.rightFrontWheel.rotate(0);
      this.leftBackWheel.rotate(0);
      this.rightBackWheel.rotate(0);
    }

  /**
   * 直线向前移动
   * @param speed 速度
   */
  moveForward(speed: number) {
    this.leftFrontWheel.rotate(speed);
    this.rightFrontWheel.rotate(speed);
    this.leftBackWheel.rotate(speed);
    this.rightBackWheel.rotate(speed);
  }

  /**
   * 直线向后移动
   * @param speed 速度
   */
  moveBackward(speed: number) {
    this.leftFrontWheel.rotate(-speed);
    this.rightFrontWheel.rotate(-speed);
    this.leftBackWheel.rotate(-speed);
    this.rightBackWheel.rotate(-speed);
  }

  /**
   * 左右平移移动
   * @param speed 速度
   */
  moveSideways(speed: number) {
    this.leftFrontWheel.rotate(-speed);
    this.rightFrontWheel.rotate(speed);
    this.leftBackWheel.rotate(speed);
    this.rightBackWheel.rotate(-speed);
  }

  /**
   * 左右旋转
   * @param speed 速度
   */
  rotate(speed: number) {
    this.leftFrontWheel.rotate(-speed);
    this.rightFrontWheel.rotate(speed);
    this.leftBackWheel.rotate(-speed);
    this.rightBackWheel.rotate(speed);
  }

  /**
   * 前右斜线移动
   * @param speed 速度
   */
  moveForwardRight(speed: number) {
    this.leftFrontWheel.rotate(speed);
    this.rightFrontWheel.rotate(0);
    this.leftBackWheel.rotate(0);
    this.rightBackWheel.rotate(speed);
  }

  /**
   * 前左斜线移动
   * @param speed 速度
   */
  moveForwardLeft(speed: number) {
    this.leftFrontWheel.rotate(0);
    this.rightFrontWheel.rotate(speed);
    this.leftBackWheel.rotate(speed);
    this.rightBackWheel.rotate(0);
  }

  /**
   * 后右斜线移动
   * @param speed 速度
   */
  moveBackwardRight(speed: number) {
    this.leftFrontWheel.rotate(0);
    this.rightFrontWheel.rotate(-speed);
    this.leftBackWheel.rotate(-speed);
    this.rightBackWheel.rotate(0);
  }

  /**
   * 后左斜线移动
   * @param speed 速度
   */
  moveBackwardLeft(speed: number) {
    this.leftFrontWheel.rotate(-speed);
    this.rightFrontWheel.rotate(0);
    this.leftBackWheel.rotate(0);
    this.rightBackWheel.rotate(-speed);
  }
}
