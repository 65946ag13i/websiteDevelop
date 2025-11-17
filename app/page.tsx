import React from "react";
import Image from "next/image";

const HomePage = () => {
  return (
    <>
      <div className="flex justify-center  ">
        <div className="w-[70%] bg-white ">
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="p-3 border--2 border-black w-full text-2xl text-center ">
              營業品項
            </h1>
            <div></div>
            <div className="text-xl text-center w-full border-y-2 border-black p-3 bg-[#B8E5AB] my-2">
              家庭電器販售
            </div>
            <div className="p-1">冰箱</div>
            <div className="p-1">洗衣機</div>
            <div className="p-1">電視</div>
            <div className="text-xl text-center w-full border-y-2 border-black p-3 bg-[#B8E5AB] my-2">
              冷氣業務
            </div>

            <div className="p-1">冷氣估價、場地評估、冷氣安裝</div>
            <div className="p-1">冷氣維修</div>
            <div className="p-1">內外機清洗</div>
            <div className="text-red-600 text-lg p-1">沒有賣二手家電及冷氣</div>
          </div>
          <div className="w-full">
            <div className="text-xl text-center w-full border-y-2 border-black p-3 bg-[#B8E5AB] my-2">
              公司資訊
            </div>
            <div className="text-center p-1">電話 04-7285890</div>
            <div className="text-center p-1">傳真 04-7285891</div>
            <div className="text-center p-1">地址:彰化縣彰化市民族路87號</div>
            <a
              className="block text-center text-blue-600 active:underline hover:text-blue-800 visited:text-purple-600  p-1"
              href="https://maps.app.goo.gl/gQmdXNJSXeL42pQv8"
              target="_blank"
              rel="noopener noreferrer"
            >
              點我前往GoogMap
            </a>
          </div>
          <div className="text-xl text-center w-full border-y-2 border-black p-3 bg-[#B8E5AB] my-2">
            老闆Line
          </div>
          <div className="flex flex-row items-center justify-center p-5">
            <div className="w-1/2 flex flex-col justify-center items-center">
              <div className="w-[60%] p-4">
                <Image
                  src="/photos/lineQRcode.jpg"
                  width={900}
                  height={900}
                  alt="QRcode"
                />
              </div>
            </div>
          </div>
          <div className=" w-[80%]  mx-auto p-4">
            <Image
              src="/photos/storePhoto.jpg"
              width={4032}
              height={3024}
              alt="storePhoto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
