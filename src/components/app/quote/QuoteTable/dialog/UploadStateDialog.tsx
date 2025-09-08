import * as Dialog from "@radix-ui/react-dialog";
import { IoClose } from "react-icons/io5";
import { BsCloudUpload } from "react-icons/bs";
import LinearProgress from "@mui/material/LinearProgress";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook/reduxHook";
import {
  setFileTotalCount,
  setFileUploadPercentage,
  setDialogOpen,
  setUploadState,
  setUploadComplete,
  setNumberOfCurrentFiles,
} from "@/redux/features/upload/uploadSlice";
import { useSession } from "next-auth/react";
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
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(newState) => dispatch(setDialogOpen(newState))}
      >
        <Dialog.Trigger asChild>
          <button>
            <BsCloudUpload className="w-full h-full" />
          </button>
        </Dialog.Trigger>

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
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              檔案上傳進度
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              <p>檔案上傳狀態:{uploadState}</p>
            </Dialog.Description>

            {uploadState === "無資料" && (
              <div>
                <div className="m-2">目前沒有上傳資料</div>
                <Dialog.Close asChild>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    離開
                  </button>
                </Dialog.Close>
              </div>
            )}

            {uploadState === "上傳中" && (
              <>
                <div className="m-1">第{numberOfCurrentFiles}個圖片上傳中</div>
                <div className="m-1">{`第${numberOfCurrentFiles}個/共${fileTotalCount}個`}</div>
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

            {uploadState === "上傳失敗" && (
              <>
                <div>
                  <div className="m-2">
                    上傳失敗，請檢查表格是否都有填到，請重新上傳
                  </div>

                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={inintUploadSlice}
                  >
                    離開
                  </button>
                </div>
              </>
            )}

            {uploadState === "上傳完成" && (
              <>
                <div>
                  <div className="m-2">上傳完成!</div>

                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    onClick={inintUploadSlice}
                  >
                    離開
                  </button>
                </div>
              </>
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
