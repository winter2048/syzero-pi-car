import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Switch,
  SwitchProps,
} from "@fluentui/react-components";
import VirtualRocker from "../../../components/virtualRocker/virtual-rocker";
import useSignalR from "../../../utils/useSignalR";
import store from "../../../store";
import {MotorHAT} from "../../../utils/constant";
import {AckermannWheel} from "../../../utils/wheel/AckermannWheel"
import {SteeringEngine} from "../../../utils/wheel/SteeringEngine"
import {Wheel} from "../../../utils/wheel/Wheel"
import "../../../style/control.css";

function Chat() {
  const [isForward, setIsForward] = React.useState(true);
  const [speed, setSpeed] = React.useState(0);
  const [direction, setDirection] = React.useState(90);
  const [isConnection, setIsConnection] = useState(true);
  const [connection, loading] = useSignalR({
    url: `${store.getState().config.SERVER_URL}/carhub`,
  });

  const wheel1 = new Wheel(connection, 0, true);
  const wheel2 = new Wheel(connection, 1);
  const wheel3 = new Wheel(connection, 2);
  const wheel4 = new Wheel(connection, 3);
  const steeringEngine = new SteeringEngine(connection);
  const ackermannWheel = new AckermannWheel(wheel1, wheel2, wheel3, wheel4, steeringEngine);

  connection?.on("Disconnect", function () {
    setIsConnection(false);
  });

  const reConnection = async () => {
    await connection?.stop();
    setIsConnection(true);
  };

  const onInitClick = async () => {
    await ackermannWheel.init();
    setDirection(90);
    setSpeed(0);
    setIsForward(true);
  }

  const onTestClick = async () => {
    await ackermannWheel.test();
  };

  const onSpeedChange = async (x: number, y: number) => {
    setSpeed(y);
  };

  const onDirectionChange = async (x: number, y: number) => {
    setDirection(x);
    if (connection) {
      await ackermannWheel.rotate(x);
    }
  };

  const onIsForwardChange: SwitchProps["onChange"]=async (_, data) => {
    setIsForward(data.checked);
  };

  React.useEffect(() => {
    if (connection && !loading) {
      ackermannWheel.move(isForward ? speed : -speed);
    } 
  }, [speed, isForward]);

  return (
    <div className="sy-control">
      <Dialog modalType="alert" open={!isConnection}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>错误</DialogTitle>
            <DialogContent>已断开连接。</DialogContent>
            <DialogActions>
              <Button appearance="primary" onClick={reConnection}>
                重新连接
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <div className="sy-control-yg">
        <div className="sy-control-yg-left">
          <div className="sy-control-yg-rocker">
            <VirtualRocker
              diameter={200}
              x={0}
              y={0}
              xAxisNum={1}
              yAxisNum={2}
              xMin={50}
              xMax={130}
              crossDirection={true}
              eX
              onChang={onDirectionChange}
            ></VirtualRocker>
          </div>
        </div>
        <div className="sy-control-yg-center">
          <text className="sy-control-speed">{speed}</text>
          <Button onClick={onInitClick} appearance="primary" shape="circular">
            重置
          </Button>
          <Button
            onClick={onTestClick}
            appearance="primary"
            shape="circular"
          >
            测试
          </Button>
          <Switch
            labelPosition="above"
            checked={isForward}
            onChange={onIsForwardChange}
            label={isForward ? "前进" : "后退"}
          />
        </div>
        <div className="sy-control-yg-right">
          <div className="sy-control-yg-rocker">
            <VirtualRocker
              diameter={200}
              x={0}
              y={0}
              xAxisNum={1}
              yAxisNum={2}
              yMin={0}
              yMax={220}
              defaultY={-100}
              crossDirection={true}
              eY
              onChang={onSpeedChange}
            ></VirtualRocker>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
