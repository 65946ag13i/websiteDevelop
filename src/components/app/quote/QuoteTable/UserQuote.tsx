"use client";
import Image from "next/image";
import { lazy, useEffect, useMemo, useState } from "react";
import URLImage from "@/components/image/URLImg";
import ButtonModule from "@/components/button/ButtonModule";
interface Order {
  id: number;
  createdAt: string;
  state: string;
  UUID: string;
  conditionerSelectedOption: string[];
  brands: string;
  remarks: string;
  userid: number;
}

const UserQuote = ({
  isLoading,
  data,
  setFunctionSwitch,
  UUID,
  quoteData,
}: {
  isLoading: boolean;
  data: string[] | null;
  // data: any;
  setFunctionSwitch: React.Dispatch<React.SetStateAction<string>>;
  quoteData: Order | null;
  UUID: string;
}) => {
  //* 回到歷史報價單表格
  const backToQuoteTable = () => {
    setFunctionSwitch("QuoteTable");
  };

  if (isLoading) return <div>資料載入中...</div>;

  console.log("quoteData:");
  console.log(quoteData);
  if (!quoteData)
    return (
      <>
        <div className="text-red-500 text-xl">查無歷史資料</div>
        <button onClick={backToQuoteTable}>回到報價單目錄</button>
      </>
    );

  console.log("data:");
  console.log(data);

  if (!data) {
    return (
      <>
        <button onClick={backToQuoteTable}>回到報價單目錄</button>
        <div>查無資料</div>
      </>
    );
    //! 改為錯誤頁面 確認後返回報價單
  }

  //~ 將陣列字串依照名稱套入循環陣列中
  //* 將陣列字串依照名稱套入循環陣列中
  const [imageArray, setImageArray] = useState<(string[] | null)[][]>([
    [null, null],
  ]);

  const groupedImages = useMemo(() => {
    const images: string[] = data;
    const result: (string[] | null)[][] = [[null, null]];

    images.forEach((image) => {
      const [firstIndex, secondIndex, fileIndex] = image.split("-").map(Number);

      if (!result[firstIndex]) {
        result[firstIndex] = [];
      }
      if (!result[firstIndex][secondIndex]) {
        result[firstIndex][secondIndex] = [];
      }
      result[firstIndex][secondIndex][fileIndex] = image;
    });

    return result;
  }, [data]);

  useEffect(() => {
    setImageArray(groupedImages);
  }, [groupedImages]);
  //~ 將陣列字串依照名稱套入循環陣列中

  return (
    <div className="p-4 ">
      <ButtonModule onClick={backToQuoteTable} size="md" className="m-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        回到報價單目錄
      </ButtonModule>
      <div className="border-2 border-gray-800 rounded-lg mt-4 bg-webGreenToBrown-400 overflow-hidden">
        <div className="mt-1 w-full border-b-2 border-gray-800">
          <h1 className=" border-b-2 border-gray-800">需要報價的品牌</h1>
          <ul className="bg-white">
            {quoteData.conditionerSelectedOption.map(
              (option: string, index) => (
                <li key={`conditionerSelectedOption:${index}`}>{option}</li>
              )
            )}
          </ul>
          {quoteData.brands == "" ? null : (
            <>
              <div className=" border-y-2 border-gray-800 ">額外的品牌需求</div>
              <div className="bg-white">{quoteData.brands}</div>
            </>
          )}

          <div>
            <div className=" border-y-2 border-gray-800 ">報價需求</div>
            <div className="bg-white">{quoteData.remarks}</div>
          </div>
        </div>
        <div className=" border-b-2 border-gray-800 ">提供的照片</div>
        <div className="bg-white flex flex-col items-center justify-center overflow-hidden">
          {/* 組別 */}
          {imageArray.map((firstIndex, index) => {
            if (Array.isArray(firstIndex)) {
              {
                /* 內外 */
                return (
                  <>
                    <div className="  px-1 mt-2 rounded-lg text-white bg-sky-500">
                      第{index + 1}組內外機照片
                    </div>
                    <div className="border-b-2 border-gray-400 w-full">
                      內機
                    </div>
                    {firstIndex[0] &&
                      firstIndex[0].map((fileName) => {
                        if (typeof fileName === "string") {
                          const params = new URLSearchParams();
                          params.append("userQuoteUUID", UUID);
                          params.append("fileName", fileName);
                          // return <div>{`${fileName}`}</div>;
                          return (
                            <div
                              className={`w-[50%] flex items-center justify-center m-2`}
                              key={`secondIndex-${fileName}`}
                            >
                              <URLImage
                                src={`${process.env.NEXT_PUBLIC_WEBSIDE_URL}/api/quoteUpload/quoteTable/searchUserImage?${params.toString()}`}
                                loading="lazy"
                                onError={(e) => {
                                  console.log("URLImage error");
                                  console.log(e);
                                }}
                                alt={fileName}
                                key={fileName}
                                fill
                                className="overflow-hidden rounded-lg object-cover"
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                    <div className="border-b-2 border-gray-400 w-full ">
                      外機
                    </div>
                    {firstIndex[1] &&
                      firstIndex[1].map((fileName) => {
                        if (typeof fileName === "string") {
                          const params = new URLSearchParams();
                          params.append("userQuoteUUID", UUID);
                          params.append("fileName", fileName);
                          // return <div>{`${fileName}`}</div>;
                          return (
                            <div
                              className={`w-[50%] flex items-center justify-center m-2`}
                              key={`secondIndex-${fileName}`}
                            >
                              <URLImage
                                src={`${process.env.NEXT_PUBLIC_WEBSIDE_URL}/api/quoteUpload/quoteTable/searchUserImage?${params.toString()}`}
                                loading="lazy"
                                onError={(e) => {
                                  console.log("URLImage error");
                                  console.log(e);
                                }}
                                alt={fileName}
                                key={fileName}
                                fill
                                className="overflow-hidden rounded-lg"
                              />
                            </div>
                          );
                        }
                        return null;
                      })}
                  </>
                );
              }
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default UserQuote;
