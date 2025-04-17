import React from "react";
import Image from "next/image";
import { AppProps } from "next/app";
import { Store } from "@reduxjs/toolkit";

interface MyAppProps extends AppProps {
  store: Store;
}

const HomePage = ({ Component, pageProps }: MyAppProps) => {
  return (
    <>
      <div className="flex justify-center  ">
        <div className="w-[70%] bg-gray-200 p-5">
          <div className="flex flex-col items-center justify-center">
            <h1 className="p-5">營業品項</h1>

            <div className="">家庭電器販售</div>
            <ul className="list-none  p-3 ">
              <li>冰箱、洗衣機、電視等產品</li>
            </ul>
            <div className="">冷氣業務</div>
            <ul className="list-none  p-3">
              <li>冷氣估價、場地評估、冷氣安裝</li>
              <li>冷氣維修、內外機清洗</li>
            </ul>

            <div className="text-red-600 text-lg">沒有賣二手家電及冷氣</div>
          </div>
          <div className="p-5">
            <div className="text-center p-5">公司資訊</div>
            <div className="text-center">電話 04-7285890</div>
            <div className="text-center">傳真 04-7285891</div>
            <div className="text-center">地址:彰化縣彰化市民族路87號</div>
            <a
              className="block text-center"
              href="https://maps.app.goo.gl/gQmdXNJSXeL42pQv8"
            >
              點我前往GoogMap
            </a>
          </div>

          <div className="flex flex-row items-center justify-center p-5">
            <div className="w-1/2 flex flex-col justify-center items-center">
              <div>老闆Line</div>
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
