"use client";
import { BsCloudUpload } from "react-icons/bs";
import { AiOutlineVerticalAlignTop } from "react-icons/ai";
import LinearProgress from "@mui/material/LinearProgress";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/redux/hook/reduxHook";
import Button from "@mui/material/Button";
const UploadState: React.FC<{}> = () => {
  const moveToTop = () => {
    console.log("啟動");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // const fileTotalCount = 123;
  // const numberOfCurrentFiles = 123;
  // const fileUploadPercentage = 123;
  // const uploadState = 123;

  const {
    fileTotalCount,
    fileUploadPercentage,
    uploadState,
    numberOfCurrentFiles,
  } = useAppSelector((state) => state.uploadState);

  const [checkBoxOpen, setCheckBoxOpen] = useState<Boolean>(false);
  const [modalOpen, setModalOpen] = useState<Boolean>(false);
  const [uploadBoxOpen, setUploadBoxOpen] = useState<Boolean>(true);
  return (
    <>
      {/* 按鈕功能 */}
      <div className=" fixed right-0 bottom-0 flex flex-col mr-2 [&>*]:mb-1 w-[7%] sm:w-[6%] md:w-[4%]  lg:w-[3%]">
        <button className="" onClick={() => moveToTop()}>
          <AiOutlineVerticalAlignTop className="w-full  h-full" />
        </button>
        <button onClick={() => setUploadBoxOpen(true)}>
          <BsCloudUpload className="w-full h-full" />
        </button>
      </div>
      <div className=" fixed right-0 bottom-0 flex flex-col w-[40%] sm:w-[25%] md:w-[20%] ">
        {/* <button className="w-full h-[100%]">
          <BsCloudUpload className="w-full h-full " />
        </button> */}
        <div className="w-full flex flex-col">
          {uploadBoxOpen ? (
            <div className="bg-white w-full  border-t-2 border-l-2 border-black z-20  text-base rounded-tl-lg overflow-hidden z-11">
              <button
                className=" bg-green-600 w-full flex justify-end relative z-40"
                onClick={() => setUploadBoxOpen(false)}
              >
                <IoClose className="mr-0.5" />
              </button>
              {/* 上傳狀態窗口 */}
              <div
                data-window="messageWindow"
                className={`flex flex-col items-center justify-center h-full w-full ${uploadState === "上傳中" ? "" : "h-full"}  overflow-hidden`}
              >
                <div className=" mt-2">
                  上傳狀態:
                  <span className="text-red-600">{`${uploadState}`}</span>
                </div>
                <hr className="w-full h-px bg-gray-300 border-0 my-2" />

                {/*無狀態區分*/}
                {uploadState === "無資料" ? (
                  <div className="m-2">目前沒有上傳資料</div>
                ) : (
                  <>
                    {" "}
                    <div className="m-1">{`第${numberOfCurrentFiles}個/共${fileTotalCount}個`}</div>
                    <div className="m-1">第{numberOfCurrentFiles}個上傳中</div>
                    <div className="flex w-full justify-center items-center z-0 mb-2">
                      <div className="w-[50%] mx-1 ">
                        <LinearProgress
                          variant="determinate"
                          value={fileUploadPercentage}
                          sx={{ zIndex: 0 }}
                        />
                      </div>
                      <div className="mx-1">{`${fileUploadPercentage}%`}</div>
                    </div>
                  </>
                )}
              </div>

              {/*上傳完成、失敗確認窗口 覆蓋上面窗口*/}
              <div
                data-modal="modalBackground"
                className={`absolute inset-0 ${uploadState === "上傳完成" || uploadState === "上傳失敗" ? "bg-white  border-black rounded-tl-lg border-t-2 border-l-2" : "h-0"}  w-full flex flex-col justify-center items-center overflow-hidden`}
              >
                <div className="m-1 px-2 py-1">{uploadState}</div>

                {uploadState === "上傳失敗" ? (
                  <div className="text-red-400 text-sm mb-2">
                    上傳失敗時請重新上傳
                  </div>
                ) : (
                  ""
                )}
                <button className="bg-blue-400 rounded px-2 py-1 m-1 text-sm">
                  確定
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {/*上傳完成確認視窗 */}

      {/* <div className="fixed top-0 right-0 bg-white px-6 py-4  border-2 border-black shadow z-20 flex flex-col items-center text-base rounded-tl-lg"> */}
      {/* <div
          data-modal="modalBackground"
          className={`absolute inset-0 ${uploadState === "上傳完成" || uploadState === "上傳失敗" ? "bg-green-700" : "h-0"} w-full flex flex-col justify-center items-center overflow-hidden`}
        >
          <div className="m-1 px-2 py-1">{uploadState}</div> */}
      {/* <Button variant="contained">確定</Button> */}
      {/* <button className="bg-blue-400 rounded px-2 py-1 m-1">確定</button>
          {uploadState === "上傳失敗" ? (
            <div className="text-red-400 text-sm">上傳失敗請重新上傳</div>
          ) : (
            ""
          )}
        </div> */}

      {/* 上傳狀態窗口 */}
      {/* <div
          data-window="messageWindow"
          className={`flex flex-col items-center justify-center h-full w-full ${uploadState === "上傳中" ? "" : "h-0"}  overflow-hidden`}
        >
          <div className="">
            上傳狀態:<span className="text-red-600">{`${uploadState}`}</span>
          </div>
          <hr className="w-full h-px bg-gray-300 border-0 my-2" />
          <div className="m-1">{`第${numberOfCurrentFiles}個/共${fileTotalCount}個`}</div>
          <div className="m-1">第{numberOfCurrentFiles}個上傳中</div>
          <div className="flex w-full justify-center items-center z-0">
            <div className="w-[50%] mx-1 ">
              <LinearProgress
                variant="determinate"
                value={fileUploadPercentage}
                sx={{ zIndex: 0 }}
              />
            </div>
            <div className="mx-1">{`${fileUploadPercentage}%`}</div>
          </div>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default UploadState;
