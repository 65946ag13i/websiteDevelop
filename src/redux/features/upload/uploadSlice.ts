import { createSlice } from "@reduxjs/toolkit";

interface initialState {
  fileTotalCount: number;
  fileUploadPercentage: number;
  numberOfCurrentFiles: number;
  windowOpen: boolean;
  uploadState: "上傳中" | "上傳失敗" | "上傳完成" | "無資料";
  uploadComplete: boolean;
}

//上傳視窗開始 上傳狀態 上傳總數 上傳進度
const initialState: initialState = {
  fileTotalCount: 0,
  fileUploadPercentage: 0,
  numberOfCurrentFiles: 0,
  windowOpen: false,
  uploadState: "無資料",
  // uploadState: "上傳完成",
  // uploadState: "上傳失敗",
  uploadComplete: false,
};

const uploadSlice = createSlice({
  name: "uploadState",
  initialState,
  reducers: {
    setFileTotalCount: (state, action) => {
      state.fileTotalCount = action.payload;
    },
    setFileUploadPercentage: (state, action) => {
      state.fileUploadPercentage = action.payload;
    },
    setNumberOfCurrentFiles: (state, action) => {
      state.numberOfCurrentFiles = action.payload;
    },
    setWindowOpen: (state, action) => {
      state.windowOpen = action.payload;
    },
    setUploadState: (state, action) => {
      state.uploadState = action.payload;
    },
    setUploadComplete: (state, action) => {
      state.uploadComplete = action.payload;
    },
  },
});

export const {
  setFileTotalCount,
  setFileUploadPercentage,
  setWindowOpen,
  setUploadState,
  setUploadComplete,
  setNumberOfCurrentFiles,
} = uploadSlice.actions;
export default uploadSlice.reducer;
