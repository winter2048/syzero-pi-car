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
import "../../../style/control.css";

function Chat() {
  const [isForward, setIsForward] = React.useState(true);
  const [speed, setSpeed] = React.useState(0);
  const [direction, setDirection] = React.useState(90);
  const [isConnection, setIsConnection] = useState(true);
  const [connection, loading] = useSignalR({
    url: `${store.getState().config.SERVER_URL}/carhub`,
  });

  connection?.on("ReceiveMessage", (sessions: ChatSessionDto[]) => {
   
  });

  connection?.on("Disconnect", function () {
    setIsConnection(false);
  });

  const reConnection = async () => {
    await connection?.stop();
    setIsConnection(true);
  };

  const onInitClick = async () => {
    await connection?.invoke("Init");
    setDirection(90);
    setSpeed(0);
    setIsForward(true);
  }

  const waitSeconds = (seconds: number) => {
    return new Promise(function(resolve) {
      setTimeout(resolve, seconds * 1000);
    });
  }

  const testDCMotor = async (num: number) => {
    await connection?.invoke("SetDCMotorSpeed", num, 20);
    await connection?.invoke("SetDCMotorDirection", num, MotorHAT.FORWARD);
    await waitSeconds(1);
    await connection?.invoke("SetDCMotorSpeed", num, 0);
    await connection?.invoke("SetDCMotorDirection", num, MotorHAT.RELEASE);
  };

  const onTestClick = async () => {
    await testDCMotor(0);
    await testDCMotor(1);
    await testDCMotor(2);
    await testDCMotor(3);
    await connection?.invoke("SetServoDirection", 60);
    await waitSeconds(1);
    await connection?.invoke("SetServoDirection", 90);
    await waitSeconds(1);
    await connection?.invoke("SetServoDirection", 120);
    await waitSeconds(1);
    await connection?.invoke("SetServoDirection", 90);
  };

  const onSpeedChange = async (x: number, y: number) => {
    setSpeed(y);
    console.log("y", y)
  };

  const run = async(speed: number) => {
    if (connection) {
      const all:Promise<any>[] = [];
      all.push(connection.invoke("SetDCMotorSpeed", 0, speed));
      all.push(connection.invoke("SetDCMotorDirection", 0,isForward? MotorHAT.FORWARD:MotorHAT.BACKWARD));

      all.push(connection.invoke("SetDCMotorSpeed", 1, speed));
      all.push(connection.invoke("SetDCMotorDirection", 1, isForward? MotorHAT.BACKWARD:MotorHAT.FORWARD));

      all.push(connection.invoke("SetDCMotorSpeed", 2, speed));
      all.push(connection.invoke("SetDCMotorDirection", 2, isForward? MotorHAT.BACKWARD:MotorHAT.FORWARD));

      all.push(connection.invoke("SetDCMotorSpeed", 3, speed));
      all.push(connection.invoke("SetDCMotorDirection", 3, isForward? MotorHAT.BACKWARD:MotorHAT.FORWARD));
      await Promise.all(all);
    }
  }

  const onDirectionChange = async (x: number, y: number) => {
    setDirection(x);
    console.log("x", x)
    await connection?.invoke("SetServoDirection", x);
  };

  const onIsForwardChange: SwitchProps["onChange"]=async (_, data) => {
    setIsForward(data.checked);
  };

  React.useEffect(() => {
    if (connection && !loading) {
      run(speed);
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
