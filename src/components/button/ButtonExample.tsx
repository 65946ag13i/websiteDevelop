// App.tsx
import React, { useState } from "react";
import Button from "./ButtonModule";

const ButtonExample: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // 模擬 API 呼叫
    setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-gray-800">TS + Tailwind Button</h1>

      {/* 主要按鈕 */}
      <Button variant="primary" size="md" onClick={() => alert("主要按鈕")}>
        主要按鈕
      </Button>

      {/* 次要按鈕 */}
      <Button variant="secondary" size="md" onClick={() => alert("次要按鈕")}>
        次要按鈕
      </Button>

      {/* 危險按鈕 */}
      <Button variant="danger" size="sm" onClick={() => alert("刪除")}>
        刪除
      </Button>

      {/* 透明按鈕 */}
      <Button variant="ghost" size="md">
        取消
      </Button>

      {/* 全寬按鈕 */}
      <Button variant="primary" fullWidth size="lg">
        全寬按鈕
      </Button>

      {/* 載入狀態 */}
      <Button variant="primary" loading={isSubmitting} onClick={handleSubmit}>
        送出表單
      </Button>

      {/* 禁用按鈕 */}
      <Button variant="primary" disabled>
        已禁用
      </Button>

      {/* 自訂樣式 */}
      <Button
        variant="primary"
        className="bg-green-600 hover:bg-green-700 focus:ring-green-500"
        onClick={() => alert("自訂按鈕")}
      >
        自訂綠色
      </Button>
    </div>
  );
};

export default ButtonExample;
