using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace SyZero.MotorDriver.Emakefun
{
    public class Servo
    {
        public int currentAngle;

        public MotorHAT MC;

        public List<int> pin;

        public int PWM_pin;

        public Servo(MotorHAT controller, int num)
        {
            this.MC = controller;
            this.pin = new List<int> {
                0,
                1,
                14,
                15,
                9,
                12,
                3,
                6
            };
            this.PWM_pin = this.pin[num];
            this.currentAngle = 0;
        }

        public virtual void writeServo(int angle)
        {
            var pulse = 4096 * (angle * 11 + 500) / 20000;
            this.MC.setPWM(this.PWM_pin, pulse);
            this.currentAngle = angle;
        }

        public virtual void writeServoWithSpeed(int angle, int speed)
        {
            if (speed == 10)
            {
                var pulse = 4096 * (angle * 11 + 500) / 20000;
                this.MC.setPWM(this.PWM_pin, pulse);
            }
            else if (angle < this.currentAngle)
            {
                foreach (var i in Enumerable.Range(0, Convert.ToInt32(Math.Ceiling(Convert.ToDouble(angle - this.currentAngle) / -1))).Select(_x_1 => this.currentAngle + _x_1 * -1))
                {
                    Thread.Sleep(4 * (10 - speed));
                    var pulse = 4096 * (i * 11 + 500) / 20000;
                    this.MC.setPWM(this.PWM_pin, pulse);
                }
            }
            else
            {
                foreach (var i in Enumerable.Range(0, Convert.ToInt32(Math.Ceiling(Convert.ToDouble(angle - this.currentAngle) / 1))).Select(_x_2 => this.currentAngle + _x_2 * 1))
                {
                    Thread.Sleep(4 * (10 - speed));
                    var pulse = 4096 * (i * 11 + 500) / 20000;
                    this.MC.setPWM(this.PWM_pin, pulse);
                }
            }
            this.currentAngle = angle;
        }

        public virtual object readDegrees()
        {
            return this.currentAngle;
        }
    }
}
