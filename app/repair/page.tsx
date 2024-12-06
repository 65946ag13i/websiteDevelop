"use client";
import React from "react";

const repairPage: React.FC = () => {
  return (
    <>
      <div
        data-mark="fixBody"
        className="flex flex-col items-center  w-[70%] mx-auto h-screen"
      >
        <div data-mark="關於維修" className=" w-full">
          <div className=" text-lg text-center w-full mx-auto">關於維修</div>
          <div
            data-mark="關於置中"
            className="block text-left max-w-md mx-auto"
          >
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
              <li>有其他故障原因，原廠更好處理問題</li>
            </ol>
            <div>機器超過八年以上都不建議維修</div>
            <div>容易出現修好一個零件壞另一個</div>
          </div>
        </div>

        <div data-mark="服務站資訊" className=" w-full text-center">
          <div data-mark="標題" className="text-lg mx-auto">
            以下提供各品牌服務站及線上報修
          </div>
          <div data-mark="控制服務站位子" className=" w-full text-center">
            <div data-mark="國際">
              <div>國際牌服務站</div>
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
            </div>
            <div data-mark="日立">
              <div>日立服務站</div>

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
            </div>
            <div data-mark="聲寶">
              <div>聲寶服務站</div>
              <a
                href="https://www.hitachiaircon.com/tw/service/maintain"
                className="text-blue-500 underline  hover:text-red-400 active:text-red-500"
                rel="noopener noreferrer"
                target="_blank"
              >
                聲寶線上維修及服務據點
              </a>
            </div>
            <div data-mark="華菱">
              <div>華菱服務站</div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default repairPage;
