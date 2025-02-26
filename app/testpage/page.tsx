import React from "react";

const VerificationCodeInput = () => {
  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      {/* Input 欄位 */}
      <input
        type="text"
        placeholder="請輸入驗證碼"
        className=" px-4 py-2 outline-none border-none"
      />
      {/* 按鈕 */}
      <button className="px-6 py-2 bg-blue-500 text-white font-medium hover:bg-blue-600 transition duration-300">
        獲取
      </button>
    </div>
  );
};

export default VerificationCodeInput;
