"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const ResizableImage = () => {
  const [width, setWidth] = useState(200); // 初始宽度
  const [isResizing, setIsResizing] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const deltaX = e.clientX - lastMousePos.x;
      console.log("e.clientX當前=" + e.clientX);
      console.log("lastMousePos.x上次=" + lastMousePos.x);
      setWidth((prevWidth) => Math.max(prevWidth + deltaX, 50)); // 设定最小宽度
      console.log(width);
      setLastMousePos({ x: e.clientX });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    setLastMousePos({ x: e.clientX });
  };

  // 使用 useEffect 来处理全局鼠标事件
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    // 清理函数
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, width, lastMousePos]); // 依赖项为 isResizing

  return (
    <div className="relative inline-block">
      <Image
        src="/photos/鸚鵡.jpg"
        alt="Resizable"
        width={width}
        height={0} // 使用 height auto
        style={{ height: "auto" }} // 高度自动适应宽度
        className="border-2 border-gray-300 object-cover"
      />
      <div
        className="absolute right-0 bottom-0 w-4 h-4 cursor-ew-resize"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

export default ResizableImage;
