import Image from "next/image";
import { lazy, useEffect, useMemo, useState } from "react";

const UserQuote = ({
  isLoading,
  data,
  setFunctionSwitch,
  UUID,
}: {
  isLoading: boolean;
  data: any;
  setFunctionSwitch: React.Dispatch<React.SetStateAction<string>>;
  UUID: string;
}) => {
  //* 回到歷史報價單表格
  const backToQuoteTable = () => {
    setFunctionSwitch("QuoteTable");
  };

  if (isLoading) return <div>資料載入中...</div>;
  if (!data || !data.userData || !data.images) {
    return <div>查無資料</div>;
    //! 改為錯誤頁面 確認後返回報價單
  }

  //~ 將陣列字串依照名稱套入循環陣列中
  //* 將陣列字串依照名稱套入循環陣列中
  const [imageArray, setImageArray] = useState<(string[] | null)[][]>([
    [null, null],
  ]);

  const groupedImages = useMemo(() => {
    const images: string[] = data.images;
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
  }, [data.images]);

  useEffect(() => {
    setImageArray(groupedImages);
  }, [groupedImages]);
  //~ 將陣列字串依照名稱套入循環陣列中

  return (
    <>
      <button onClick={backToQuoteTable}>回到報價單目錄</button>
      <div>
        <div>
          <div>需要報價的品牌</div>
          <ul>
            {data.userData.conditionerSelectedOption.map((option: string) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          <div>以填寫需求的品牌</div>
          <div>{data.userData.bands}</div>
        </div>

        <div>
          <div>報價需求</div>
          <div>{data.userData.remarks}</div>
        </div>

        <div>
          {/* 組別 */}
          {imageArray.map((firstIndex) => {
            if (Array.isArray(firstIndex)) {
              {
                /* 內外 */
              }
              return firstIndex.map((secondIndex) => {
                if (Array.isArray(secondIndex)) {
                  {
                    /* 字串陣列展開 */
                  }
                  return secondIndex.map((fileString) => {
                    if (typeof fileString === "string") {
                      const params = new URLSearchParams();
                      params.append("userQuoteUUID", UUID);
                      params.append("fileString", fileString);
                      return (
                        <div className="key={fillString} w-[50%]">
                          <Image
                            src={`/api/quoteUpload/quoteTable?${params.toString()}`}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = "";
                              e.currentTarget.style.display = "none";
                            }}
                            alt={fileString}
                            fill
                          />
                        </div>
                      );
                    }
                    return null;
                  });
                }
                return null;
              });
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
};

export default UserQuote;
