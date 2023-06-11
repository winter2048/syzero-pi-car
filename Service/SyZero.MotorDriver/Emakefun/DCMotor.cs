using System;
using System.Collections.Generic;
using System.Text;

namespace SyZero.MotorDriver.Emakefun
{
    public class DCMotor
    {
        public int _speed;

        public int IN1pin;

        public int IN2pin;

        public MotorHAT MC;

        public object motornum;

        public DCMotor(MotorHAT controller, int num)
        {
            int in2;
            this.MC = controller;
            this.motornum = num;
            var in1 = 0;
            this._speed = 0;
            if (num == 0)
            {
                in2 = 13;
                in1 = 11;
            }
            else if (num == 1)
            {
                in2 = 8;
                in1 = 10;
            }
            else if (num == 2)
            {
                in2 = 2;
                in1 = 4;
            }
            else if (num == 3)
            {
                in2 = 5;
                in1 = 7;
            }
            else
            {
                throw new Exception("MotorHAT Motor must be between 1 and 4 inclusive");
            }
            //self.PWMpin = pwm
            this.IN1pin = in1;
            this.IN2pin = in2;
        }

        public virtual void run(int command)
        {
            if (command == MotorHAT.FORWARD)
            {
                this.MC.setPin(this.IN2pin, 0);
                this.MC.setPWM(this.IN1pin, this._speed * 16);
            }
            if (command == MotorHAT.BACKWARD)
            {
                this.MC.setPin(this.IN1pin, 0);
                this.MC.setPWM(this.IN2pin, this._speed * 16);
            }
            if (command == MotorHAT.RELEASE)
            {
                this.MC.setPin(this.IN1pin, 0);
                this.MC.setPin(this.IN2pin, 0);
            }
        }

        public virtual void setSpeed(int speed)
        {
            if (speed < 0)
            {
                speed = 0;
            }
            if (speed > 255)
            {
                speed = 255;
            }
            //self.MC._pwm.setPWM(self.PWMpin, 0, speed*16)
            this._speed = speed;
        }
    }
}
