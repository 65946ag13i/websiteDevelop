import * as Dialog from "@radix-ui/react-dialog";
import { IoClose } from "react-icons/io5";
import { BsCloudUpload } from "react-icons/bs";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/reduxHook";
import {
  setFileTotalCount,
  setFileUploadPercentage,
  setDialogOpen,
  setUploadState,
  setUploadComplete,
  setNumberOfCurrentFiles,
} from "@/redux/features/upload/uploadSlice";

type Props = {};

const UploadStateDialog = (props: Props) => {
  const dispatch = useAppDispatch();

  const {
    dialogOpen,
    fileTotalCount,
    fileUploadPercentage,
    uploadState,
    numberOfCurrentFiles,
  } = useAppSelector((state) => state.uploadState);

  const inintUploadSlice = () => {
    dispatch(setDialogOpen(false));
    dispatch(setFileTotalCount(0));
    dispatch(setFileUploadPercentage(0));
    dispatch(setUploadState("無資料"));
    dispatch(setUploadComplete(false));
    dispatch(setNumberOfCurrentFiles(0));
  };

  return (
    <>
      <button onClick={() => dispatch(setDialogOpen(true))}>
        <BsCloudUpload className="w-full h-full" />
      </button>
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(newState) => dispatch(setDialogOpen(newState))}
      >
        {/* <Dialog.Trigger asChild>
          
        </Dialog.Trigger> */}

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700 outline-none"
            onEscapeKeyDown={(e) => {
              e.preventDefault();
            }}
            onInteractOutside={(e) => {
              e.preventDefault();
            }}
          >
            <div></div>
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              檔案上傳進度
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <p>檔案上傳狀態:{uploadState}</p>
            </Dialog.Description>

            {uploadState === "無資料" && (
              <div className="flex flex-col items-center py-4">
                <div className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  <p className="mt-2">目前沒有上傳資料</p>
                </div>
                <Dialog.Close asChild>
                  <button className="px-3  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                    離開
                  </button>
                </Dialog.Close>
              </div>
            )}

            {uploadState === "上傳中" && (
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 "></div>
                  <span>第{numberOfCurrentFiles}個圖片上傳中</span>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-400">{`第${numberOfCurrentFiles}個/共${fileTotalCount}個`}</div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-[70%]">
                    <LinearProgress
                      variant="determinate"
                      value={fileUploadPercentage}
                      sx={{
                        zIndex: 0,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#e5e7eb",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 5,
                          backgroundColor: "#3b82f6",
                        },
                      }}
                    />
                  </div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">{`${fileUploadPercentage}%`}</div>
                </div>
              </div>
            )}

            {uploadState === "上傳失敗" && (
              <div className="flex flex-col items-center py-4">
                <div className="text-red-600 dark:text-red-400 mb-4 text-center">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 font-medium">上傳失敗</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 max-w-xs">
                    請檢查表格是否都有填到，請重新上傳
                  </p>
                </div>
                <button
                  className="px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg"
                  onClick={inintUploadSlice}
                >
                  離開
                </button>
              </div>
            )}

            {uploadState === "上傳完成" && (
              <div className="flex flex-col items-center py-4">
                <div className="text-green-600 dark:text-green-400 mb-6 text-center">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 font-medium text-xl">上傳完成!</p>
                </div>
                <button
                  className="px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg"
                  onClick={inintUploadSlice}
                >
                  離開
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default UploadStateDialog;
{
  /* <Dialog.Close ></Dialog.Close > */
}
