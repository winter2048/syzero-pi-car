using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace SyZero.MotorDriver.Emakefun
{
    public class StepperMotor
    {
        public int AIN1;

        public int AIN2;

        public int BIN1;

        public int BIN2;

        public int currentstep;

        public MotorHAT MC;

        public int motornum;

        public int revsteps;

        public double sec_per_step;

        public int steppingcounter;

        public int MICROSTEPS = 8;

        public List<int> MICROSTEP_CURVE = new List<int> {
            0,
            50,
            98,
            142,
            180,
            212,
            236,
            250,
            255
        };

        public StepperMotor(MotorHAT controller, int num, int steps = 200)
        {
            this.MC = controller;
            this.revsteps = steps;
            this.motornum = num;
            this.sec_per_step = 0.1;
            this.steppingcounter = 0;
            this.currentstep = 0;
            num -= 1;
            if (num == 0)
            {
                //self.PWMA = 8
                this.AIN2 = 13;
                this.AIN1 = 11;
                //self.PWMB = 13
                this.BIN2 = 10;
                this.BIN1 = 8;
            }
            else if (num == 1)
            {
                //self.PWMA = 2
                this.AIN2 = 2;
                this.AIN1 = 4;
                //self.PWMB = 7
                this.BIN2 = 5;
                this.BIN1 = 7;
            }
            else
            {
                throw new Exception("MotorHAT Stepper must be between 1 and 2 inclusive");
            }
        }

        public virtual void setSpeed(int rpm)
        {
            this.sec_per_step = 60.0 / (this.revsteps * rpm);
            this.steppingcounter = 0;
        }

        public virtual int oneStep(int dir, int style)
        {
            object pwm_b;
            var pwm_a = 255;
            // first determine what sort of stepping procedure we're up to
            if (style == MotorHAT.SINGLE)
            {
                if (Convert.ToBoolean(this.currentstep / (this.MICROSTEPS / 2) % 2))
                {
                    // we're at an odd step, weird
                    if (dir == MotorHAT.FORWARD)
                    {
                        this.currentstep += this.MICROSTEPS / 2;
                    }
                    else
                    {
                        this.currentstep -= this.MICROSTEPS / 2;
                    }
                }
            }
            else
            {
                // go to next even step
                if (dir == MotorHAT.FORWARD)
                {
                    this.currentstep += this.MICROSTEPS;
                }
                else
                {
                    this.currentstep -= this.MICROSTEPS;
                }
            }
            if (style == MotorHAT.DOUBLE)
            {
                if (!Convert.ToBoolean((this.currentstep / (this.MICROSTEPS / 2) % 2)))
                {
                    // we're at an even step, weird
                    if (dir == MotorHAT.FORWARD)
                    {
                        this.currentstep += this.MICROSTEPS / 2;
                    }
                    else
                    {
                        this.currentstep -= this.MICROSTEPS / 2;
                    }
                }
                else
                {
                    // go to next odd step
                    if (dir == MotorHAT.FORWARD)
                    {
                        this.currentstep += this.MICROSTEPS;
                    }
                    else
                    {
                        this.currentstep -= this.MICROSTEPS;
                    }
                }
            }
            if (style == MotorHAT.INTERLEAVE)
            {
                if (dir == MotorHAT.FORWARD)
                {
                    this.currentstep += this.MICROSTEPS / 2;
                }
                else
                {
                    this.currentstep -= this.MICROSTEPS / 2;
                }
            }
            if (style == MotorHAT.MICROSTEP)
            {
                if (dir == MotorHAT.FORWARD)
                {
                    this.currentstep += 1;
                }
                else
                {
                    this.currentstep -= 1;
                    // go to next 'step' and wrap around
                    this.currentstep += this.MICROSTEPS * 4;
                    this.currentstep %= this.MICROSTEPS * 4;
                    pwm_a = 0;
                }
                if (this.currentstep >= 0 && this.currentstep < this.MICROSTEPS)
                {
                    pwm_a = this.MICROSTEP_CURVE[this.MICROSTEPS - this.currentstep];
                    pwm_b = this.MICROSTEP_CURVE[this.currentstep];
                }
                else if (this.currentstep >= this.MICROSTEPS && this.currentstep < this.MICROSTEPS * 2)
                {
                    pwm_a = this.MICROSTEP_CURVE[this.currentstep - this.MICROSTEPS];
                    pwm_b = this.MICROSTEP_CURVE[this.MICROSTEPS * 2 - this.currentstep];
                }
                else if (this.currentstep >= this.MICROSTEPS * 2 && this.currentstep < this.MICROSTEPS * 3)
                {
                    pwm_a = this.MICROSTEP_CURVE[this.MICROSTEPS * 3 - this.currentstep];
                    pwm_b = this.MICROSTEP_CURVE[this.currentstep - this.MICROSTEPS * 2];
                }
                else if (this.currentstep >= this.MICROSTEPS * 3 && this.currentstep < this.MICROSTEPS * 4)
                {
                    pwm_a = this.MICROSTEP_CURVE[this.currentstep - this.MICROSTEPS * 3];
                    pwm_b = this.MICROSTEP_CURVE[this.MICROSTEPS * 4 - this.currentstep];
                }
            }
            // go to next 'step' and wrap around
            this.currentstep += this.MICROSTEPS * 4;
            this.currentstep %= this.MICROSTEPS * 4;
            // only really used for microstepping, otherwise always on!
            //self.MC._pwm.setPWM(self.PWMA, 0, pwm_a*16)
            //self.MC._pwm.setPWM(self.PWMB, 0, pwm_b*16)
            // set up coil energizing!
            var coils = new List<int> {
                0,
                0,
                0,
                0
            };
            if (style == MotorHAT.MICROSTEP)
            {
                if (this.currentstep >= 0 && this.currentstep < this.MICROSTEPS)
                {
                    coils = new List<int> {
                        1,
                        1,
                        0,
                        0
                    };
                }
                else if (this.currentstep >= this.MICROSTEPS && this.currentstep < this.MICROSTEPS * 2)
                {
                    coils = new List<int> {
                        0,
                        1,
                        1,
                        0
                    };
                }
                else if (this.currentstep >= this.MICROSTEPS * 2 && this.currentstep < this.MICROSTEPS * 3)
                {
                    coils = new List<int> {
                        0,
                        0,
                        1,
                        1
                    };
                }
                else if (this.currentstep >= this.MICROSTEPS * 3 && this.currentstep < this.MICROSTEPS * 4)
                {
                    coils = new List<int> {
                        1,
                        0,
                        0,
                        1
                    };
                }
            }
            else
            {
                var step2coils = new List<List<int>> {
                    new List<int> {
                        1,
                        0,
                        0,
                        0
                    },
                    new List<int> {
                        1,
                        1,
                        0,
                        0
                    },
                    new List<int> {
                        0,
                        1,
                        0,
                        0
                    },
                    new List<int> {
                        0,
                        1,
                        1,
                        0
                    },
                    new List<int> {
                        0,
                        0,
                        1,
                        0
                    },
                    new List<int> {
                        0,
                        0,
                        1,
                        1
                    },
                    new List<int> {
                        0,
                        0,
                        0,
                        1
                    },
                    new List<int> {
                        1,
                        0,
                        0,
                        1
                    }
                };
                coils = step2coils[Convert.ToInt32(this.currentstep / (this.MICROSTEPS / 2))];
            }
            //print "coils state = " + str(coils)
            this.MC.setPin(this.AIN2, coils[0]);
            this.MC.setPin(this.BIN1, coils[1]);
            this.MC.setPin(this.AIN1, coils[2]);
            this.MC.setPin(this.BIN2, coils[3]);
            return this.currentstep;
        }

        public virtual void step(int steps, int direction, int stepstyle)
        {
            var s_per_s = this.sec_per_step;
            var lateststep = 0;
            if (stepstyle == MotorHAT.INTERLEAVE)
            {
                s_per_s = s_per_s / 2.0;
            }
            if (stepstyle == MotorHAT.MICROSTEP)
            {
                s_per_s /= this.MICROSTEPS;
                steps *= this.MICROSTEPS;
                Console.WriteLine(s_per_s.ToString(), " sec per step");
            }
            foreach (var s in Enumerable.Range(0, steps))
            {
                lateststep = this.oneStep(direction, stepstyle);
                Thread.Sleep(Convert.ToInt32(s_per_s * 1000));
            }
            if (stepstyle == MotorHAT.MICROSTEP)
            {
                // this is an edge case, if we are in between full steps, lets just keep going
                // so we end on a full step
                while (lateststep != 0 && lateststep != this.MICROSTEPS)
                {
                    lateststep = this.oneStep(direction, stepstyle);
                    Thread.Sleep(Convert.ToInt32(s_per_s * 1000));
                }
            }
        }
    }
}
