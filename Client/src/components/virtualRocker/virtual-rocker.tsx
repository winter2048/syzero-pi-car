import React,{ useState, useRef }  from "react";
import Hammer from "hammerjs"
import "../../style/virtualRocker.css";

export interface ContentProps {
  diameter: number;
  x: number;
  y: number;
  crossDirection?: boolean;
  xAxisNum: number;
  yAxisNum: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  defaultX?: number;
  defaultY?: number;
  eX?: boolean;
  eY?: boolean;
  debug?: boolean;
  onChang?: (x: number, y: number) => void;
}

export const CircleButton = (props: ContentProps) => {
    const { diameter, x, y, crossDirection, xAxisNum, yAxisNum, eX, eY, debug, xMin, xMax, yMin, yMax, defaultX, defaultY } = props;
    const [isOpen, setIsOpen] = useState(false);
    const [cPosX, setCPosX] = useState(0);
    const [cPosY, setCPosY] = useState(0);
    const virtualRockerRef = React.useRef<HTMLDivElement>(null);

    var current_CrossDirection = "";

    var radius = diameter / 2;
    var virtualRockerDiameter = radius;
    var virtualRockerRadius = virtualRockerDiameter / 2;
    var virtualRockerMove = false;

    React.useEffect(() => {
        if (debug) {
            console.log(cPosX, cPosY);
        }
        if (props.onChang) {
            let cx = cPosX;
            let cy = cPosY;
            if (xMin !== undefined && xMax !== undefined) {
              cx = ((cPosX + 100) / 200) * (xMax - xMin) + xMin;
            }
            if (yMin !== undefined && yMax !== undefined) {
              cy = ((cPosY + 100) / 200) * (yMax - yMin) + yMin;
            }
            props.onChang(parseInt(cx.toString()), parseInt(cy.toString()));
        }
    }, [cPosX, cPosY])
    
    React.useEffect(() => {
        if (virtualRockerRef.current) {
            let hammer1 = "";
            let startX:number, startY:number, moveEndX:number, moveEndY:number;
            let virtualRockerStartX:number, virtualRockerStartY:number;
            const hammerVirtualRocker = new Hammer(virtualRockerRef.current);
            hammerVirtualRocker.get('pan').set({ direction: Hammer.DIRECTION_ALL });

            hammerVirtualRocker.on('panstart panmove panend pancancel', function (ev) {
                hammer1 += "evType:" + ev.type + " deltaX:" + ev.deltaX + " deltaY:" + ev.deltaY + "<br>";
                //console.log("evType:" + ev.type + " deltaX:" + ev.deltaX + " deltaY:" + ev.deltaY);
                //$("#divTips2").html(hammer1);

                if (ev.type == "panstart") {
                    panStart(ev);
                }
                else if (ev.type == "panmove") {
                    panMove(ev);
                }
                else if (ev.type == "panend" || ev.type == "pancancel") {
                    panEnd(ev);
                }
            });

            const panStart = (e: HammerInput) => {
                //开始移动
                startX = e.deltaX - 50 + (defaultX ?? 0);
                startY = e.deltaY - 50 + (defaultY ?? 0);
                
                if (virtualRockerRef.current) {
                    virtualRockerStartX = virtualRockerRef.current.clientLeft;
                    virtualRockerStartY = virtualRockerRef.current.clientTop;
                }

                virtualRockerMove = true;
            };

            const panMove = (e: HammerInput) => {
                if (!virtualRockerMove) return;

                moveEndX = e.deltaX;
                moveEndY = e.deltaY;

                var moveX = moveEndX - startX, moveY = moveEndY - startY;
                moveX += virtualRockerStartX;
                moveY += virtualRockerStartY;

                //超出宽度
                if (moveX <= -virtualRockerRadius) moveX = -virtualRockerRadius;
                if ((moveX + virtualRockerDiameter) > (diameter + virtualRockerRadius)) moveX = (diameter - virtualRockerRadius);

                if (moveY <= -virtualRockerRadius) moveY = -virtualRockerRadius;
                if ((moveY + virtualRockerDiameter) > (diameter + virtualRockerRadius)) moveY = (diameter - virtualRockerRadius);

                //遥感内圈圆点
                var virtualRockerX = moveX + virtualRockerRadius, virtualRockerY = moveY + virtualRockerRadius;

                //移动的距离大于半径时
                var moveRadius = Math.sqrt(Math.pow(Math.abs((virtualRockerX) - radius), 2) + Math.pow(Math.abs((virtualRockerY) - radius), 2));
                if (moveRadius > radius) {
                    var isLeft = virtualRockerX - radius < 0;
                    var isTop = virtualRockerY - radius < 0;

                    var ps = GetPoint(radius, radius, virtualRockerX, virtualRockerY, radius, radius, radius);
                    let p = null;

                    if (isLeft) p = ps[1];
                    else p = ps[0];

                    moveX = p.x - virtualRockerRadius;
                    moveY = p.y - virtualRockerRadius;
                }

                var isLeft = (moveX + virtualRockerRadius) - radius < 0;
                var isRight = (moveX + virtualRockerRadius) - radius > 0;
                var isTop = (moveY + virtualRockerRadius) - radius < 0;
                var isBottom = (moveY + virtualRockerRadius) - radius > 0;

                if (crossDirection) {
                    //十字方向
                    if (current_CrossDirection == "") {
                        if (parseInt(Math.abs(moveX - radius + virtualRockerRadius).toString()) > parseInt(Math.abs(moveY - radius + virtualRockerRadius).toString())) {
                            //X
                            moveY = virtualRockerRadius;
                            if (current_CrossDirection == "") current_CrossDirection = "X";
                        }
                        else {
                            //Y
                            moveX = virtualRockerRadius;
                            if (current_CrossDirection == "") current_CrossDirection = "Y";
                        }
                    }
                    else {
                        if (current_CrossDirection == "X") {
                            moveY = virtualRockerRadius;
                            if (eY) {
                                moveX = virtualRockerRadius;
                            }
                        }
                        else if (current_CrossDirection == "Y") {
                            moveX = virtualRockerRadius;
                            if (eX) {
                                moveY = virtualRockerRadius;
                            }
                        }
                    }
                }

                var posX = parseInt((moveX - radius + virtualRockerRadius).toString());
                var posY = -parseInt((moveY - radius + virtualRockerRadius).toString());

                var text = " ";
                text += isLeft ? "左" : isRight ? "右" : "";
                text += isTop ? "上" : isBottom ? "下" : "";
                text += " ";
                text += " X(" + xAxisNum + ")：" + posX;
                text += " Y(" + yAxisNum + ")：" + posY;
                //$("#divTips").text(text);
                if (debug) {
                    console.log("Tips:", text);
                }
                setCPosX(posX);
                setCPosY(posY);

                if (virtualRockerRef.current) {
                    virtualRockerRef.current.style.left = moveX + "px";
                    virtualRockerRef.current.style.top = moveY + "px";
                }
                ShowVirtualRockerInfo(moveX, moveY);
            };
            const panEnd = (e: HammerInput) => {
                //停止移动
                virtualRockerMove = false;
                current_CrossDirection = "";

                if (virtualRockerRef.current) {
                    virtualRockerRef.current.style.left = (virtualRockerRadius - (defaultX ?? 0)) + "px";
                    virtualRockerRef.current.style.top = (virtualRockerRadius - (defaultY ?? 0)) + "px";
                }
                setCPosX(defaultX ?? 0);
                setCPosY(defaultY ?? 0);
                HideVirtualRockerInfo();
            };

            const ShowVirtualRockerInfo = (moveX:number, moveY:number) => {
                //显示摇杆信息
                var isLeft = (moveX + virtualRockerRadius) - radius < 0;
                var isRight = (moveX + virtualRockerRadius) - radius > 0;
                var isTop = (moveY + virtualRockerRadius) - radius < 0;
                var isBottom = (moveY + virtualRockerRadius) - radius > 0;

                var text = isLeft ? "左" : isRight ? "右" : "";
                text += isTop ? "上" : isBottom ? "下" : "";

                text += "X：" + parseInt(Math.abs(moveX - radius + virtualRockerRadius).toString());
                text += " Y：" + parseInt(Math.abs(moveY - radius + virtualRockerRadius).toString());

                //$("#divVirtualRockerInfo").text(text);
                if (debug) {
                    console.log("VirtualRockerInfo: ", text);
                }
            }
            const HideVirtualRockerInfo = () => {
                //$("#divVirtualRockerInfo").text("");
            }

              /**
             * 求圆和直线之间的交点
             * 直线方程：y = kx + b
             * 圆的方程：(x - m)² + (x - n)² = r²
             * x1, y1 = 线坐标1, x2, y2 = 线坐标2, m, n = 圆坐标, r = 半径
             */
              const GetPoint = (x1:number, y1:number, x2:number, y2:number, m:number, n:number, r:number) => {
                let kbArr = binaryEquationGetKB(x1, y1, x2, y2)
                let k = kbArr[0]
                let b = kbArr[1]

                let aX = 1 + k * k
                let bX = 2 * k * (b - n) - 2 * m
                let cX = m * m + (b - n) * (b - n) - r * r

                let insertPoints:{x:number; y:number}[] = []
                let xArr = quadEquationGetX(aX, bX, cX)
                xArr.forEach(function (x) {
                    let y = k * x + b
                    insertPoints.push({ x: x, y: y })
                })
                return insertPoints
            }
            /**
             * 求二元一次方程的系数
             * y1 = k * x1 + b => k = (y1 - b) / x1
             * y2 = k * x2 + b => y2 = ((y1 - b) / x1) * x2 + b
             */
            const binaryEquationGetKB=(x1:number, y1:number, x2:number, y2:number)=> {
                let k = (y1 - y2) / (x1 - x2)
                let b = (x1 * y2 - x2 * y1) / (x1 - x2)
                return [k, b]
            }
            /**
             * 一元二次方程求根
             * ax² + bx + c = 0
             */
            const quadEquationGetX=(a:number, b:number, c:number)=> {
                let xArr = []
                let result = Math.pow(b, 2) - 4 * a * c
                if (result > 0) {
                    xArr.push((-b + Math.sqrt(result)) / (2 * a))
                    xArr.push((-b - Math.sqrt(result)) / (2 * a))
                } else if (result == 0) {
                    xArr.push(-b / (2 * a))
                }
                return xArr
            }
           
        }
      
    
        // 组件卸载时销毁hammerjs
        return () => {
         // mc.destroy();
        }
      }, []);

    return (
        <div data-kq='control' data-type='VirtualRocker' className='VirtualRockerBox' style={{width: `${diameter}px`, height: `${diameter}px`, lineHeight: `${diameter}px`, borderRadius: `${diameter}px`, left: `${x}px`, top: `${y}px` }}>
            <div className='VirtualRocker' ref={virtualRockerRef} style={{width: `${virtualRockerDiameter}px`, height:`${virtualRockerDiameter}px`, left:`${virtualRockerRadius - (defaultX ?? 0)}px`, top:`${virtualRockerRadius - (defaultY ?? 0)}px`}} ></div>
            {crossDirection?(<>
                {eX ? <div className='VirtualRockerLineX' style={{left: `0px`, top: `${radius}px`}}></div>:<></>}
                   { eY ? <div className='VirtualRockerLineY' style={{left: `${radius}px`, top: `0px`}}></div>:<></>}
                </>):(<></>)}
        </div>
    );
};
export default CircleButton;
