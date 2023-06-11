import React,{ useState }  from "react";
import "../../style/virtualRocker.css";

export interface ContentProps {
  title: string;
  diameter: number;
  left: number;
  top: number;
  onClick?: Function;
}

export const CircleButton = (props: ContentProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const onClickCircle = () => {
        setIsOpen(!isOpen);
        if (props.onClick) {
            props.onClick();
        }
    }
    
    return (
        <div>
        <a onClick={onClickCircle} className={isOpen?"aCircle aActived":"aCircle"} data-kq='control' data-type='Button_Circle' style={{width: `${props.diameter}px`, height: `${props.diameter}px`, lineHeight: `${props.diameter}px`, borderRadius: `${props.diameter}px`, left: `${props.left}px`, top: `${props.top}px` }} >
            {props.title}
        </a>
        </div>
    );
};
export default CircleButton;
