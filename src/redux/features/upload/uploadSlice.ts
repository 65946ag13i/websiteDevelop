import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  fileTotalCount: number;
  fileUploadPercentage: number;
  numberOfCurrentFiles: number;
  dialogOpen: boolean;
  uploadState: "上傳中" | "上傳失敗" | "上傳完成" | "無資料";
  uploadComplete: boolean;
}

//上傳視窗開始 上傳狀態 上傳總數 上傳進度
const initialState: InitialState = {
  fileTotalCount: 0,
  fileUploadPercentage: 0,
  numberOfCurrentFiles: 0,
  dialogOpen: false,
  uploadState: "無資料",
  // uploadState: "上傳完成",
  // uploadState: "上傳失敗",
  // uploadState: "上傳中",
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
    setDialogOpen: (state, action) => {
      state.dialogOpen = action.payload;
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
  setDialogOpen,
  setUploadState,
  setUploadComplete,
  setNumberOfCurrentFiles,
} = uploadSlice.actions;
export default uploadSlice.reducer;
