"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      // setIsFixed(window.scrollY > 100);
    }
    const handleScroll = () => {
      console.log("window:" + window.scrollY);
      console.log("sticky:" + sticky);
      if (window.scrollY > sticky) {
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
  const urlSet = usePathname();

  return (
    <>
      <div
        id="navbar"
        className={`flex flex-row ${isFixed ? "fixed top-0 left-0" : ""}  items-center justify-center divide-x divide-black bg-white w-full z-10 border-y-2 border-black`}
      >
        <div
          className={`px-4  ${urlSet == "/" ? "bg-webGreenToBrown-700" : ""}`}
        >
          <Link href="/">首頁</Link>
        </div>
        <div
          className={`px-4 selection:${urlSet == "/repair" ? "bg-webGreenToBrown-700" : ""}`}
        >
          <Link href="/repair">維修</Link>
        </div>
        <div
          className={`px-4 ${urlSet == "/quote" ? "bg-webGreenToBrown-700" : ""}`}
        >
          <Link href="/quote">簡易報價</Link>
        </div>
        <div
          className={`px-4 ${urlSet == "/example" ? "bg-webGreenToBrown-700" : ""}`}
        >
          <Link href="/example">冷氣髒污案例</Link>
        </div>

        {/* <a href="/Recruitment" className="px-4">
      招募
    </a> */}
      </div>
    </>
  );
};

export default NavigationBar;
