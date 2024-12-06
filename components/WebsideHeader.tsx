import React from "react";

const WebsideHeader: React.FC = () => {
  return (
    <nav>
      <div className="flex items-center justify-center  bg-red-400 text-3xl  p-6  ">
        <a href="/">建豐電器股份有限公司</a>
      </div>

      <div className="bg-blue-600 flex  m-3 absolute right-0 top-3">
        <a className="bg-green-400 p-1 m-1" href="/signin">
          登入
        </a>
        <a className="bg-yellow-300 p-1  m-1" href="/register">
          註冊
        </a>
      </div>
    </nav>
  );
};

export default WebsideHeader;
