
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using SyZero.MotorDriver.Emakefun;

namespace SyZero.PiCar.Service.Hubs
{
    public class CarHub : Hub
    {
        public static HashSet<string> ActiveConnections = new HashSet<string>();
        private readonly MotorHAT _motorHAT;
        private readonly List<DCMotor> _dCMotors;
        private readonly Servo _servo;

        public CarHub(MotorHAT motorHAT)
        {
            _motorHAT = motorHAT;

            _dCMotors = new List<DCMotor>() {
             _motorHAT.getMotor(1),
             _motorHAT.getMotor(2),
             _motorHAT.getMotor(3),
             _motorHAT.getMotor(4)
            };

            _servo = _motorHAT.getServo(1);
        }

        public override Task OnConnectedAsync()
        {
            ActiveConnections.Add(Context.ConnectionId);

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            ActiveConnections.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        public void Init()
        {
            foreach (var dCMotor in _dCMotors)
            {
                dCMotor.run(MotorHAT.RELEASE);
            }
            _servo.writeServo(90);
        }

        public void SetDCMotorSpeed(int motor, int speed)
        {
            _dCMotors[motor].setSpeed(speed);
        }

        public void SetDCMotorDirection(int motor, int direction)
        {
            _dCMotors[motor].run(direction);
        }

        /// <summary>
        /// 0 - 180  90
        /// </summary>
        /// <param name="direction"></param>
        public void SetServoDirection(int direction)
        {
            if (direction >= 50 && direction <= 130)
            {
                _servo.writeServo(direction);
            }
        }
    }
}
