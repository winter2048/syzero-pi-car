import * as React from "react";
import userSvg from '../../assets/user.svg';
import aiSvg from '../../assets/ai.svg';
import OmsViewMarkdown from '../markdown/OmsViewMarkdown';

export interface ContentProps {
  role: number;
  name?: string;
  text: string;
}

export const SyChatMessage = (props: ContentProps) => {
  if (props.role === 1) {
    return (
      <div className="sy-chat-room-center-left">
        <div className="sy-chat-room-center-img"><img src={ aiSvg } alt="ai"></img></div>
        <div className="sy-chat-room-center-content">
          <div className="sy-chat-room-center-content-name">{props.name}</div>
          <div className="sy-chat-room-center-content-text">
            <div className="sy-chat-room-text">
            <OmsViewMarkdown textContent={props.text}  darkMode={true} switchRight={true}/>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="sy-chat-room-center-right">
        <div className="sy-chat-room-center-img"><img src={ userSvg } alt="user"></img></div>
        <div className="sy-chat-room-center-content">
          <div className="sy-chat-room-center-content-text">
            <div className="sy-chat-room-text">
            <OmsViewMarkdown textContent={props.text}  darkMode={true} switchRight={false}/>
             </div>
          </div>
        </div>
      </div>
    );
  }
};
export default SyChatMessage;
