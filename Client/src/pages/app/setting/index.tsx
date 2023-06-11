import React, { useState } from "react";
import {
  Button,
  ToolbarButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  Textarea,
  TextareaProps,
  TextareaOnChangeData,
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Switch,
  SwitchProps,
  SwitchOnChangeData,
  Slider,
  SliderProps,
  Label
} from "@fluentui/react-components";
import SyChatMessage from "../../../components/sy-chat/sy-chat-message";
import SyChatSession from "../../../components/sy-chat/sy-chat-session";
import SyScrollList from "../../../components/sy-scroll-list";
import CircleButton from "../../../components/virtualRocker/circle-button";
import VirtualRocker from "../../../components/virtualRocker/virtual-rocker";
import { OpenAI } from "../../../api";
import { weChatDate } from "../../../utils/date";
import useSignalR from "../../../utils/useSignalR";
import store from "../../../store";
import {MotorHAT} from "../../../utils/constant";
import "../../../style/chat.css";

function Chat() {
  const [isForward, setIsForward] = React.useState(true);
  const [speed, setSpeed] = React.useState(0);
  const [direction, setDirection] = React.useState(90);
  const [isConnection, setIsConnection] = useState(true);
  const hasMountedRef = React.useRef(false);
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

  const onClick = async ()=>{
    await connection?.invoke("SetDCMotorSpeed", 1, 20);
    await connection?.invoke("SetDCMotorDirection", 1, MotorHAT.FORWARD);
  }

  const onSpeedChange: SliderProps["onChange"] = async (_, data) => {
    setSpeed(data.value);
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

  const onDirectionChange: SliderProps["onChange"] =async (_, data) => {
    setDirection(data.value);
    await connection?.invoke("SetServoDirection", data.value);
  };

  const onIsForwardChange: SwitchProps["onChange"]=async (_, data) => {
    setIsForward(data.checked);
  };

  React.useEffect(() => {
    if (connection) {
      run(speed);
    } 
  }, [speed, isForward]);

  return (
    <div className="sy-chat">
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
      <Button onClick={onInitClick}>初始化</Button>
      <Button onClick={onClick}>Test</Button>
      <Label>
        Direction: {direction}
      </Label>
      <Slider
        value={direction}
        min={50}
        max={130}
        defaultValue={90}
        onChange={onDirectionChange}
      />
      <Label>
        Speed : {speed}
      </Label>
      <Slider
        vertical 
        value={speed}
        min={0}
        max={220}
        onChange={onSpeedChange}
      />
     <Switch
      checked={isForward}
      onChange={onIsForwardChange}
      label={isForward ? "前进" : "后退"}
    />
    </div>
  );
}

export default Chat;
