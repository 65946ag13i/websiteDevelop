"use client";
import React, { useState, useEffect } from "react";
// fixed top-0 left-0 w-full
const NavigationBar: React.FC = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [sticky, setSticky] = useState(0);

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    // console.log(navbar);
    if (navbar) {
      setSticky(navbar.offsetTop); // 設置 sticky 位置
    }

    const handleScroll = () => {
      if (window.scrollY >= sticky) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 清除滾動事件監聽器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sticky]); // 只在 sticky 改變時執行
  return (
    <div
      id="navbar"
      className={`flex flex-row ${isFixed ? "fixed top-0 left-1/2 transform -translate-x-1/2" : ""}  items-center justify-center divide-x divide-gray-400 bg-white w-full z-10`}
    >
      <a href="/" className=" px-4">
        首頁
      </a>
      <a href="/repair" className="px-4">
        維修
      </a>
      <a href="/quote" className="px-4">
        報價
      </a>
      <a href="/example" className="px-4">
        冷氣髒污案例
      </a>
      <a href="/Recruitment" className="px-4">
        招募
      </a>
    </div>
  );
};

export default NavigationBar;
