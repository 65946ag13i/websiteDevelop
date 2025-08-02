import React, { useState, useEffect } from "react";

interface CountdownButtonProps {
  onResend: () => void; // 當倒數結束後要執行的動作
  normalLabel?: string;
  CountdownLabel?: string;
  className?: string;
  initialCount?: number;
}

const CooldownButton: React.FC<CountdownButtonProps> = ({
  onResend,
  normalLabel = "送出",
  CountdownLabel = "還需等待:",
  className = "",
  initialCount = 60,
}) => {
  const [count, setCount] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

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

  const buttonText = isActive ? `${CountdownLabel} (${count})` : normalLabel;

  return (
    <button onClick={handleClick} disabled={isActive} className={className}>
      {buttonText}
    </button>
  );
};

export default CooldownButton;
