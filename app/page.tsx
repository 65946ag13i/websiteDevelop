import React from "react";
import { jsx } from "react/jsx-runtime";
import Image from "next/image";

const companyGooglMmap = `<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d227.68483708051738!2d120.5376698!3d24.0678049!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693887be82f8b7%3A0xd71523b487606238!2z5bu65piH6KGM6Zu75Zmo5pyJ6ZmQ5YWs5Y-477yI5bu66LGQ6Zu75Zmo5pyJ6ZmQ5YWs5Y-477yJ!5e0!3m2!1szh-TW!2stw!4v1725444681644!5m2!1szh-TW!2stw"
  width="100%" height="100%"
  style="border:0;" allowfullscreen=""
  loading="lazy" 
  referrerpolicy="no-referrer-when-downgrade"></iframe>
`;

const HomePage: React.FC = () => {
  return (
    <>
      <div className="flex justify-center  ">
        <div className="w-[70%] bg-gray-200 p-5">
          <div className="flex flex-col items-center justify-center">
            <h1 className="p-5">營業項目</h1>
            <ul className="list-disc  p-3 ">
              <li className="relative left-[-5px]">家庭電器販售</li>
              <ul className="list-disc  p-3">
                <li>冰箱、洗衣機、電視...等</li>
              </ul>
              <li className="relative left-[-5px]">冷氣業務</li>
              <ul className="list-disc  p-3">
                <li>冷氣估價、場地評估、冷氣安裝</li>
                <li>冷氣維修、內外機清洗</li>
              </ul>
            </ul>

            <div className="text-red-600 text-lg">沒有賣二手家電及冷氣</div>
          </div>
          <div className="p-5">
            <div className="text-center p-5">公司資訊</div>
            <div className="text-center ">電話 04-7285890</div>
            <div className="text-center ">傳真 04-7285891</div>
            <div className="text-center ">地址:彰化縣彰化市民族路87號</div>
          </div>

          <div className="flex flex-row items-center justify-center p-5">
            <div className="w-1/2 flex flex-col justify-center items-center">
              <div>老闆Line</div>
              <div className="w-[60%] p-4">
                <Image
                  src="/photos/lineQRcode.jpg"
                  width={900}
                  height={900}
                  layout="responsive"
                  alt="QRcode"
                />
              </div>
            </div>

            <div className="w-1/2 flex justify-center relative aspect-w-5 aspect-h-1">
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: companyGooglMmap }}
              ></div>
            </div>
          </div>
          <div className=" w-[80%]  mx-auto p-4">
            <Image
              src="/photos/storePhoto.jpg"
              layout="responsive"
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
