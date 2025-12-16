import React, { useState, useEffect } from "react";

interface CountdownButtonProps {
  onResend: () => void; // 當倒數結束後要執行的動作
  normalLabel?: string;
  CountdownLabel?: string;
  className?: string;
  initialCount?: number;
  controlDisabled?: [boolean, string];
}

const CooldownButton: React.FC<CountdownButtonProps> = ({
  onResend,
  normalLabel = "送出",
  CountdownLabel = "還需等待",
  className = "",
  initialCount = 60,
  controlDisabled = [false, "父元件控制按鈕禁用"],
}) => {
  const [count, setCount] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (isActive && count !== null && count > 0) {
      timer = setInterval(() => {
        setCount((prev) => (prev as number) - 1);
      }, 1000);
    } else if (count === 0) {
      setIsActive(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, count]);

  const handleClick = () => {
    if (isActive) return; // 如果正在倒數中，不允許再按

    setCount(initialCount);
    setIsActive(true);
    onResend(); // 執行外部傳入的 resend 函數（例如發送驗證碼）
  };

  const buttonText =
    controlDisabled[0] == true
      ? controlDisabled[1]
      : isActive
        ? `${CountdownLabel}: (${count})`
        : normalLabel;

  const buttonDiabled =
    controlDisabled[0] == true ? true : isActive ? true : false;

  return (
    <button
      onClick={handleClick}
      disabled={buttonDiabled}
      className={className}
      type="button"
    >
      {buttonText}
    </button>
  );
};

export default CooldownButton;
