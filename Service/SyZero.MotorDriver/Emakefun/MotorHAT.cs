using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SyZero.MotorDriver.Emakefun
{
    public class MotorHAT
    {
        public int _frequency;

        public object _i2caddr;

        public PWM _pwm;

        public List<DCMotor> motors;

        public List<Servo> servos;

        public List<StepperMotor> steppers;

        public static int FORWARD = 1;

        public static int BACKWARD = 2;

        public static int BRAKE = 3;

        public static int RELEASE = 4;

        public static int SINGLE = 1;

        public static int DOUBLE = 2;

        public static int INTERLEAVE = 3;

        public static int MICROSTEP = 4;

        public MotorHAT(byte addr = 0x60, int freq = 50)
        {
            this._i2caddr = addr;
            this._frequency = freq;
            this.servos = (from n in Enumerable.Range(0, 8)
                           select new Servo(this, n)).ToList();
            this.motors = (from m in Enumerable.Range(0, 4)
                           select new DCMotor(this, m)).ToList();
            this.steppers = new List<StepperMotor> {
                new StepperMotor(this, 1),
                new StepperMotor(this, 2)
            };
            this._pwm = new PWM(addr, debug: false);
            this._pwm.setPWMFreq(this._frequency);
        }

        public virtual void setPin(int pin, int value)
        {
            if (pin < 0 || pin > 15)
            {
                throw new Exception("PWM pin must be between 0 and 15 inclusive");
            }
            if (value != 0 && value != 1)
            {
                throw new Exception("Pin value must be 0 or 1!");
            }
            if (value == 0)
            {
                this._pwm.setPWM(pin, 0, 4096);
            }
            if (value == 1)
            {
                this._pwm.setPWM(pin, 4096, 0);
            }
        }

        public virtual void setPWM(int pin, int value)
        {
            if (value > 4095)
            {
                this._pwm.setPWM(pin, 4096, 0);
            }
            else
            {
                this._pwm.setPWM(pin, 0, value);
            }
        }

        public virtual StepperMotor getStepper(int num)
        {
            if (num < 1 || num > 2)
            {
                throw new Exception("MotorHAT Stepper must be between 1 and 2 inclusive");
            }
            return this.steppers[num - 1];
        }

        public virtual DCMotor getMotor(int num)
        {
            if (num < 1 || num > 4)
            {
                throw new Exception("MotorHAT Motor must be between 1 and 4 inclusive");
            }
            return this.motors[num - 1];
        }

        public virtual Servo getServo(int num)
        {
            if (num < 1 || num > 8)
            {
                throw new Exception("MotorHAT Motor must be between 1 and 8 inclusive");
            }
            return this.servos[num - 1];
        }
    }

}
