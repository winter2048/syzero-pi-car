import * as React from "react";
export interface ContentProps {
  title: string;
  text: string;
  date: string;
  onClick?: Function;
  select: boolean;
}

export const SyChatSession = (props: ContentProps) => {
  
  return (
    <div className={props.select? "sy-chat-session-item sy-chat-session-item-select" : "sy-chat-session-item"} onClick={()=>{ props.onClick && props.onClick(); }} >
      <div className="sy-chat-session-item-img">{props.title.substring(0,3)}</div>
      <div className="sy-chat-session-item-content">
        <div className="sy-chat-session-item-content-title">{props.title}</div>
        <div className="sy-chat-session-item-content-text">{props.text}</div>
      </div>
      <div className="sy-chat-session-item-time">{props.date}</div>
    </div>
  );
};
export default SyChatSession;
