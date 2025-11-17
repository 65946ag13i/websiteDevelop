"use client";
import React from "react";
import LinkCards from "@/components/card/LinkCards";
const repairPage: React.FC = () => {
  return (
    <>
      <div className="flex flex-col items-center  w-[70%] mx-auto bg-white">
        <div className=" w-full">
          <div className="text-xl text-center w-full border-b-2 border-black p-3 bg-[#B8E5AB] ">
            關於維修
          </div>
          <div className="block text-left max-w-md mx-auto p-1">
            由於現在的電器都是微電腦，幾乎都要找公司才能修理
            <br />
            只有冷氣相關才能處理，包含漏水、不會冷...等問題才能處理
            <br />
            但凡電腦相關都需要找原廠處理。
            <br />
            建議找原廠處理的原因有:
            <br />
            <ol className="list-decimal self-start list-inside relative left-[5px]">
              <li>我們維修處理的沒有原廠保固</li>
              <li>有其他故障原因，原廠更容易問題</li>
            </ol>
            <div className="text-red-600">
              機器超過八年以上都不建議維修，容易出現修好一個壞另一個
            </div>
          </div>
        </div>

        <div className=" w-full text-center">
          <div className="text-xl text-center w-full border-y-2 border-black p-3 bg-[#B8E5AB] ">
            以下提供各品牌服務站及線上報修
          </div>
          <div className="flex flex-col my-4 items-center gap-4 w-full text-center [&>*:nth-child(even)]:bg-gray-200 ">
            <LinkCards title="國際牌">
              <div>
                <a
                  href="https://pmst.panasonic.com.tw/FAQ/Article/1791"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  國際牌服務站地址
                </a>
              </div>
              <div>
                <a
                  href="https://club.panasonic.tw/member/?url=guar/online-fix-policy"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  線上報修
                </a>
              </div>
            </LinkCards>

            <LinkCards title="日立" subtitle="日立家電和日立冷氣是不同公司">
              <div>
                <a
                  href="https://www.hitachiaircon.com/tw/service/maintain"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  日立冷氣線上報修 (服務站地址在最底下)
                </a>
              </div>
              <div>
                <a
                  href="https://hitachi-homeappliances.com.tw/service/"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  日立家電線上報修
                </a>
              </div>
            </LinkCards>

            <LinkCards title="聲寶">
              <div>
                <a
                  href="https://www.sampo.com.tw/service_reply.aspx?q=0"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  聲寶線上維修
                </a>
              </div>
              <div>
                <a
                  href="https://www.sampo.com.tw/storefinder.aspx?storetype=%E6%9C%8D%E5%8B%99%E6%93%9A%E9%BB%9E"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  服務據點
                </a>
              </div>
            </LinkCards>

            <LinkCards title="華菱">
              <div>
                <a
                  href="https://twhawrin.com/%e5%85%a8%e5%9c%8b%e6%9c%8d%e5%8b%99%e6%93%9a%e9%bb%9e/"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  華菱服務站
                </a>
              </div>
              <div>
                <a
                  href="https://twhawrin.com/%e8%ab%ae%e8%a9%a2%e6%88%91%e5%80%91/"
                  className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  華菱線上報修
                </a>
              </div>
            </LinkCards>
          </div>
        </div>
      </div>
    </>
  );
};

export default repairPage;
