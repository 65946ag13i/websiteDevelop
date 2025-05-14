"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hook/reduxHook";
import {
  setFileTotalCount,
  setFileUploadPercentage,
  setWindowOpen,
  setUploadState,
  setNumberOfCurrentFiles,
} from "@/redux/features/upload/uploadSlice";
interface uploadFileWithWorker {
  pictureName: string;
  file: File;
  fileUUID: string;
}

function uploadFileWithWorker(
  uploadFileWithWorker: uploadFileWithWorker,
  worker: Worker
): Promise<{ success: boolean }> {
  return new Promise((resolve, reject) => {
    const dispatch = useAppDispatch();
    worker.postMessage(uploadFileWithWorker);
    worker.onmessage = (event) => {
      const { success, progress } = event.data;
      switch (success) {
        case "uploading":
          //設定進度
          dispatch(setFileUploadPercentage(progress));
          break;
        case "failure":
          //進度取消
          dispatch(setUploadState("上傳失敗"));
          reject({ success: false });
          break;
        case "success":
          //總進度完成+1
          resolve({ success: true });
          console.log("123");
          break;
        default:
          reject({ success: false });
          break;
      }
    };
    worker.onerror = () => {
      reject({ success: false });
    };
  });
}

const repairPage: React.FC = () => {
  // const session = useSession();

  //子組件上移
  const [photoURL, setPhotoURL] = useState<(string[] | null)[][]>([
    [null, null],
  ]);
  const [photoFile, setphotoFile] = useState<(File[] | null)[][]>([
    [null, null],
  ]);

  //檢查錯誤後函式推入列隊
  //創建UUID,worker
  //導出總照片數量、上傳陣列
  async function fileSequentially(fileUUID: string, worker: Worker) {
    const UUID = fileUUID;
    const uploadQueue: (() => Promise<{ success: boolean }>)[] = [];

    for (const [index, firstNested] of photoFile.entries()) {
      if (index < 4) {
        //基本欄位最大3組
        for (const [secondIndex, secondNested] of firstNested.entries()) {
          if (!secondNested || secondNested.length == 0) {
            //如果沒有照片數組或為空,返回0及空數組
            return { uploadQueue: [] };
          }

          if (secondIndex < 2) {
            //內外機只有兩組別
            for (const [fileindex, file] of secondNested.entries()) {
              if (fileindex < 2) {
                //照片最大2張
                const props: uploadFileWithWorker = {
                  pictureName: file.name,
                  file,
                  fileUUID: UUID,
                };
                uploadQueue.push(() => {
                  return uploadFileWithWorker(props, worker);
                });
              }
            }
          }
        }
      }
    }
    return { uploadQueue };
  }
  //簡易認證文字表單
  async function easyFormWordCheck(): Promise<boolean> {
    if (
      conditionerSelectedOption.length !== 0 &&
      bands.length <= 60 &&
      remarks.length <= 60
    ) {
      return true;
    }

    return false;
  }
  //子組件上移
  //----前言開關-----
  const [isOpen, setOpen] = useState(true); //前言
  const toggleAccordion = () => {
    setOpen(!isOpen);
  };
  //----前言開關-----
  const [remarks, setRemarks] = useState("");
  const [bands, setBands] = useState("");
  //----日曬checkbox-----
  // const [selectedOption, setSelectedOption] = useState<string>("no");
  // const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedOption(e.target.value);
  //   console.log(e.target.value);
  //   console.log(selectedOption); //這裡是異步的所以結果還沒fulfilled要用useEffect
  // };

  //----日曬checkbox-----

  //----品牌選擇-----
  const [conditionerSelectedOption, setconditionerSelectedOption] = useState<
    string[]
  >([]);

  const conditionerCheckboxHandle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (conditionerSelectedOption.includes(value)) {
      setconditionerSelectedOption(
        conditionerSelectedOption.filter((filter) => {
          return filter !== value;
        })
      );
    } else {
      setconditionerSelectedOption([...conditionerSelectedOption, value]);
    }
  }; //e傳進來是value  傳入option(str) 改變check(boolean)
  //----品牌選擇-----
  //功能測試
  // useEffect(() => {
  //   console.log("effect結果:" + selectedOption);
  //   console.log("conditioner結果:" + conditionerSelectedOption);
  // }, [selectedOption, conditionerSelectedOption]);

  //-----坪數大小設置-----

  //每填一個數值直接重設每個格子比較快，寫太複雜
  const [squareMeter, setsquareMeter] = useState<string | number>("");
  const [ping, setping] = useState<string | number>("");

  const handleSquareMeterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    if (!isNaN(value)) {
      setsquareMeter(value);
    } else {
      setsquareMeter("");
    }

    if (!isNaN(value)) {
      setping((value / 3.305785).toFixed(2));
      setlength("");
      setwidth("");
    } else {
      setping("");
    }
  };

  const handlePingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setping(value);
    } else {
      setping("");
    }

    if (!isNaN(value)) {
      setsquareMeter((value * 3.305785).toFixed(2));
      setlength("");
      setwidth("");
    } else {
      setsquareMeter("");
    }
  };

  const [length, setlength] = useState<string | number>("");
  const [width, setwidth] = useState<string | number>("");

  const saveLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setlength(value);
  };

  const saveWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setwidth(value);
  };

  const squareCalculation = () => {
    const result = Number(length) * Number(width);
    return result;
  };

  useEffect(() => {
    const result = squareCalculation();
    if (!isNaN(result)) {
      setsquareMeter(result);
      setping((result / 3.305785).toFixed(2));
    } else {
      setping("");
    }
  }, [length, width]);

  //-----坪數大小設置-----
  //夾帶token、定義處理方法、UUID定義組別
  //上傳文字、UUID到後端 並都加入表 建立相片分片儲存資料夾 (立一個分區 使用者 內或外機(01) 相片資料夾)
  //照片分片寫入indexedDB 含有UUID 內外機(01) 相片編號 總分片數 第幾個分片
  //併發上傳所有分片到後端資料夾  依照區別儲存 UUID 內外機(01) 相片編號 總分片數 第幾個分片
  //回復完成結果

  // const { data: session, status } = useSession();

  const dataUpload = async () => {
    const UUID = crypto.randomUUID();
    const upload = { UUID, conditionerSelectedOption, bands, remarks };
    const worker = new Worker(
      new URL("../../src/utils/webWorker/fileUpload.ts", import.meta.url)
    );
    //驗證圖片數量，返回圖片總量、待上傳異步陣列，傳入UUID
    const imageCheck = await fileSequentially(UUID, worker);
    if (imageCheck.uploadQueue.length == null) {
      return;
    }
    const imageArray = imageCheck.uploadQueue;
    //簡易驗證字符串
    const formWordCheck: boolean = await easyFormWordCheck();
    //驗證表單及圖片數量後啟動上傳
    if (formWordCheck && imageArray.length !== 0) {
      //後端建立表單
      //todo 記得寫try
      const contentUpload = await fetch(
        `${process.env.WEBSIDE_URL}/api/register/emailAuthentication`,
        {
          method: "POST",
          headers: { "content-type": "applicatiaion/json" },
          credentials: "include",
          body: JSON.stringify(upload),
        }
      );
      if (contentUpload.ok) {
        const dispatch = useAppDispatch();
        //定義相片總數
        dispatch(setFileTotalCount(imageArray.length));
        //開啟上傳視窗
        dispatch(setWindowOpen(true));

        //循環上傳相片異步陣列
        dispatch(setUploadState("上傳中"));
        for (let index = 0; index < imageArray.length; index++) {
          //相片加一
          dispatch(setNumberOfCurrentFiles(index + 1));
          //todo 寫try
          try {
            const element: { success: boolean } = await imageArray[index]();
            if (element.success == false) {
              dispatch(setUploadState("上傳失敗"));
              break;
            }
          } catch (error) {
            dispatch(setUploadState("上傳失敗"));
            break;
          } finally {
            dispatch(setFileUploadPercentage(0));
          }
        }
        dispatch(setUploadState("上傳完成"));
      }
      //關閉worker

      worker.terminate();
    }

    //如果文字表單上傳成功 圖片上傳 啟動分片
    // if (true) {
    //   const worker = new Worker(
    //     new URL("../../utils/webWorker/fileUpload.ts", import.meta.url)
    //   );
    // }
  };
  interface imageUpload {
    pictureName: string;
    file: File;
    fileUUID: string;
  }
  console.log("顯示登入資訊:");
  // console.dir(session, { depth: null });
  return (
    <div className="flex flex-col  justify-center w-full sm:w-[90%]  min-h-screen ">
      <div className="flex flex-col items-center m-2">
        <div className="m-2 p-1 ">使用報價系統請先登入</div>
        <div>
          <Link
            href="/signin"
            className="p-1 m-2 border-2 border-gray-900 rounded-lg shadow"
          >
            登入
          </Link>
          <Link
            href="/register"
            className="p-1 m-2 border-2 border-gray-900 rounded-lg shadow"
          >
            註冊
          </Link>
        </div>
      </div>

      <div
        data-mark="前言塊"
        className="max-w-lg mx-auto border-2 border-gray-900 overflow-hidden rounded m-2 p-2 shadow"
      >
        <div
          className="text-center border-b-2 border-gray-400 "
          onClick={toggleAccordion}
        >
          ▼ 通知 ▼
        </div>

        <div
          className={`overflow-hidden text-start ${isOpen ? "max-h-full" : "max-h-0"}`}
        >
          夏季工作較忙報價通常需7個工作天 <br />
          老闆工作繁忙時，無法馬上報價 <br />
          如太久沒報價請再通知老闆報價
        </div>
      </div>
      {/* {session ? <div>123</div> : <div>123</div>} */}

      <div
        data-mark="報價模塊"
        className="flex-col sm:inline-flex sm:flex-row  sm:w-full sm: rounded overflow-hidden shadow m-2 border-gray-900 border-2"
      >
        <div className="text-center border-b-2 sm:w-1/5 sm:border-b-0 sm:border-r-2 border-gray-900 ">
          <div className="flex  justify-center  sm:justify-normal sm:inline-flex sm:flex-col p-2">
            <a className="p-1 m-1  border-2 border-gray-900 rounded-lg shadow">
              新估價
            </a>
            <a className="p-1 m-1 border-2 border-gray-900 rounded-lg shadow">
              歷史估價
            </a>
            <a className="p-1 m-1 border-2 border-gray-900 rounded-lg shadow">
              修改密碼
            </a>
            <a className="p-1 m-1 border-2  border-gray-900 rounded-lg shadow">
              登出
            </a>
          </div>
        </div>
        <div className="text-center  sm:w-4/5  bg-gray-100 ">
          {/*報價品牌*/}
          <div className="flex flex-col items-center mt-1">
            <div className="border-gray-400 border-b-2  w-full ">
              <div className="text-lg">請選擇需要報價的品牌</div>
              <div>任何品牌都歡迎詢問</div>
              <div>
                <label>
                  <input
                    type="checkbox"
                    value="國際牌"
                    checked={conditionerSelectedOption.includes("國際牌")}
                    onChange={conditionerCheckboxHandle}
                  />
                  國際牌
                </label>

                <label>
                  <input
                    type="checkbox"
                    value="日立"
                    checked={conditionerSelectedOption.includes("日立")}
                    onChange={conditionerCheckboxHandle}
                  />
                  日立
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="華菱"
                    checked={conditionerSelectedOption.includes("華菱")}
                    onChange={conditionerCheckboxHandle}
                  />
                  華菱
                </label>
              </div>
              <div>其餘品牌可以在以下填寫</div>

              <textarea
                maxLength={60}
                placeholder="請輸入想要的其他品牌"
                value={bands}
                onChange={(e) => setBands(e.target.value)}
                rows={5}
                cols={40}
                className=" m-2 border-2 border-gray-950 rounded resize-y leading-tight shadow"
              />
            </div>
            {/*報價品牌*/}

            {/* <div className="grid grid-cols-3 grid-rows-2 gap-4">
                <div className="bg-red-500 p-4">Item 1</div>
                <div className="bg-blue-500 p-4">Item 2</div>
                <div className="bg-green-500 p-4">Item 3</div>
                <div className="bg-yellow-500 p-4">Item 4</div>
                <div className="bg-purple-500 p-4">Item 5</div>
                <div className="bg-pink-500 p-4">Item 6</div>
              </div>

              <div className="grid grid-rows-3 grid-cols-3 gap-4 h-96">
                <div className="bg-teal-500 p-4 col-span-3">Header</div>
                <div className="bg-indigo-500 p-4 row-span-2">Sidebar</div>
                <div className="bg-gray-500 p-4 col-span-2">Main Content</div>
                <div className="bg-orange-500 p-4 col-span-2">Footer</div>
              </div> */}
            {/*西曬選擇*/}
            {/* <div
                className="flex flex-col sm:flex-row justify-center border-b-2  pb-2 border-gray-400 w-full"
                data-mark="西曬"
              >
                <div className="m-1 b-1">
                  房間牆面是否有受到太陽照射或是在最頂樓?
                </div>
                <div className="m-1 b-1">
                  <label>
                    是
                    <input
                      type="radio"
                      value="yes"
                      className="ml-1"
                      name="gettingSunlight"
                      checked={selectedOption === "yes"} //check=boolean=選中
                      onChange={handleOptionChange}
                    />
                  </label>
                </div>
                <div className="m-1 b-1">
                  <label>
                    否
                    <input
                      type="radio"
                      value="no"
                      className="ml-1"
                      checked={selectedOption === "no"}
                      onChange={handleOptionChange}
                    />
                  </label>
                </div>
              </div> */}
            {/*西曬選擇*/}

            {/*圖片建議內容*/}
            <div className=" w-full">
              <div className=" inline-flex flex-col ">
                <div className="text-lg">
                  請盡量提供以下內容圖片，比較好報價
                </div>
                <div className="">
                  <ol
                    type="1"
                    className=" text-left relative left-4 list-decimal"
                  >
                    <li>內機安裝位置</li>
                    <li>外機安裝位置</li>
                  </ol>
                </div>
              </div>
            </div>

            {/*圖片建議內容*/}
            <div className="w-full border-b-2 border-gray-400">
              <ImageUpload
                photoFile={photoFile}
                setphotoFile={setphotoFile}
                photoURL={photoURL}
                setPhotoURL={setPhotoURL}
              />
            </div>
            {/*坪數計算*/}
            <div className=" mb-2 p-2 w-full border-gray-400 border-b-2  ">
              <div className="text-lg pb-2">
                坪數計算機
                <br />
                選擇一欄自動換算
              </div>
              <div className="inline-grid grid-rows-3 grid-cols-2  border-2 border-black  place-items-center rounded">
                <div className="col-span-2 border-b-2 border-black flex  w-full h-full  items-center justify-center">
                  <div className="m-1">
                    <label htmlFor="length">長(公尺): </label>
                    {/*leading-tight等價CSS line-height:1.25*/}
                    <input
                      className="leading-tight mr-2 border-2 border-black rounded text-center w-12"
                      placeholder="0"
                      type="number"
                      id="length"
                      value={length}
                      onChange={saveLength}
                    />
                  </div>
                  <div>
                    <label htmlFor="width">寬(公尺): </label>
                    <input
                      className="leading-tight mr-2 border-2 border-black rounded text-center w-12"
                      placeholder="0"
                      type="number"
                      id="width"
                      value={width}
                      onChange={saveWidth}
                    />
                  </div>
                </div>
                {/* <div className="col-span-1 bg-white">
                 
                </div> */}
                <div className="col-span-1  border-b-2  border-black  w-full h-full flex items-center justify-center">
                  <label htmlFor="squareMeter">平方公尺:</label>
                </div>
                <div className="col-span-1   border-b-2 border-black  w-full h-full flex items-center justify-center">
                  <input
                    className="leading-tight mr-2 border-2 border-black rounded text-center w-16"
                    type="number"
                    id="squareMeter"
                    value={squareMeter}
                    onChange={handleSquareMeterChange}
                  />
                </div>
                <div className="col-span-1  w-full h-full flex items-center justify-center">
                  <label htmlFor="ping">坪數:</label>
                </div>
                <div className="col-span-1   w-full h-full flex items-center justify-center">
                  <input
                    className="leading-tight mr-2 border-2 border-black rounded text-center w-16"
                    type="number"
                    id="ping"
                    value={ping}
                    onChange={handlePingChange}
                  />
                </div>
              </div>
            </div>
            {/*坪數計算*/}

            <div className="w-full flex flex-col items-center">
              <div>
                <div className="text-lg">請填寫以下需求選項</div>
                <ol className="list-decimal text-left space-y-2">
                  <li>請填寫各房間坪數</li>
                  <li>房間是否有太陽照射或在頂樓?</li>
                  <li>
                    房間是否需要鑽孔到室外?
                    <br />
                    是否有地方讓管線到戶外?
                    <br />
                    如果沒有就必須鑽孔
                  </li>
                </ol>
              </div>

              <textarea
                maxLength={200}
                placeholder="請在此輸入..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={5}
                cols={40}
                className=" m-2 border-2 border-gray-950 rounded resize-y leading-tight shadow"
              />
            </div>

            <button className="px-1 mb-2 border-2 border-gray-900 rounded-lg shadow">
              送出
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default repairPage;
