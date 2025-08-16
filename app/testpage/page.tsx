"use client"; // components/ToastTest.tsx
import { useState, useRef, useEffect } from "react";

export default function ToastTest() {
  const [show, setShow] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setShow(!show);
  };

  // 強制瀏覽器在 show 變化時觸發 reflow
  useEffect(() => {
    if (show && toastRef.current) {
      // 強制 layout 計算，確保動畫從 scaleY(0) 開始
      toastRef.current.getBoundingClientRect();
    }
  }, [show]);

  return <div className="scale-y-0">Test</div>;
}
