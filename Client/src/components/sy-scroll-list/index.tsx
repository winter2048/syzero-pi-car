import React, { useRef, useEffect, useImperativeHandle } from "react";

const SyScroll = React.forwardRef((props: {
  children: JSX.Element | JSX.Element[] | undefined;
  className?: string;
}, ref) =>  {
  const parentRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  const resizeChild = () => {
    if (parentRef.current && childRef.current) {
      const parentWidth = parentRef.current.clientWidth;
      const childWidth = parentWidth - 8; // 计算子元素的宽度
      if (childWidth !== childRef.current.clientWidth) {
        childRef.current.style.width = `${childWidth}px`; // 设置子元素的宽度
      }
    }
  };

  useEffect(() => {
    resizeChild();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", resizeChild); // 添加resize事件监听器
    return () => {
      window.removeEventListener("resize", resizeChild); // 在组件卸载时移除resize事件监听器
    };
  }, [parentRef, childRef]);

  useImperativeHandle(ref, () => ({
    parentRef,
    childRef
  }));

  return (
    <div
      className={
        props.className
          ? `${props.className} sy-list-hover-scroll`
          : "sy-list-hover-scroll"
      }
      ref={parentRef}
    >
      <div ref={childRef}>{props.children}</div>
    </div>
  );
});

export default SyScroll;
