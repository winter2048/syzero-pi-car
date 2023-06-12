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
  Slider,
  SliderProps,
  SliderOnChangeData
} from "@fluentui/react-components";
import VirtualRocker from "../../../components/virtualRocker/virtual-rocker";
import useSignalR from "../../../utils/useSignalR";
import store from "../../../store";
import {MotorHAT} from "../../../utils/constant";
import {MecanumWheel} from "../../../utils/wheel/MecanumWheel";
import {Wheel} from "../../../utils/wheel/Wheel";
import upSvg from '../../../assets/up.svg';
import upPng from '../../../assets/up.png';
import clockwisePng from '../../../assets/clockwise.png';
import clockwiseSvg from '../../../assets/clockwise.svg';
import "../../../style/control.css";

function Chat() {
  const [isForward, setIsForward] = React.useState(true);
  const [speed, setSpeed] = React.useState(0);
  const [isConnection, setIsConnection] = useState(true);
  const [connection, loading] = useSignalR({
    url: `${store.getState().config.SERVER_URL}/carhub`,
  });

  const wheel1 = new Wheel(connection, 0, true);
  const wheel2 = new Wheel(connection, 1);
  const wheel3 = new Wheel(connection, 2);
  const wheel4 = new Wheel(connection, 3);
  const mecanumWheel = new MecanumWheel(wheel3, wheel4, wheel1, wheel2);

  connection?.on("Disconnect", function () {
    setIsConnection(false);
  });

  const reConnection = async () => {
    await connection?.stop();
    setIsConnection(true);
  };

  const onInitClick = async () => {
    //await mecanumWheel.init();
    setSpeed(0);
    setIsForward(true);
  }

  const onTestClick = async () => {
    //await mecanumWheel.test();
  };

  const onSpeedChange: SliderProps["onChange"] = async (ev: React.ChangeEvent<HTMLInputElement>, data: SliderOnChangeData) => {
    setSpeed(data.value);
  };

  const onIsForwardChange: SwitchProps["onChange"]=async (_, data) => {
    setIsForward(data.checked);
  };

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
          <div className="sy-control-yg-mc">
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveForwardLeft(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{transform:'rotate(-45deg)', backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}} /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveForward(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}} /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveForwardRight(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{transform:'rotate(45deg)', backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}}  /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveSideways(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{transform:'rotate(-90deg)', backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}}  /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.rotate(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{width:'35px',height:'35px', opacity:'.65', backgroundImage: `url(${clockwisePng})`, backgroundSize: 'cover'}}  /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveSideways(isForward ? -speed : speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{transform:'rotate(90deg)', backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}}  /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveBackwardLeft(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{transform:'rotate(-120deg)', backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}}  /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveBackward(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{transform:'rotate(180deg)', backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}}  /></div>
            <div className="sy-control-button" onTouchStart={()=>{mecanumWheel.moveBackwardRight(isForward ? speed : -speed)}} onTouchEnd={()=>{mecanumWheel.stop()}}><div className="sy-control-icon" style={{transform:'rotate(120deg)', backgroundImage: `url(${upPng})`, backgroundSize: 'cover'}}  /></div>
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
            label={isForward ? "正向" : "反向"}
          />
        </div>
        <div className="sy-control-yg-right">
          <text>速度</text>
        <Slider vertical min={0} max={220} defaultValue={0} value={speed} onChange={onSpeedChange} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
