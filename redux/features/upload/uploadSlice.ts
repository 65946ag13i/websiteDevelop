import { createSlice } from "@reduxjs/toolkit";

const uploadSlice = createSlice({
  name: "uploadState",
  initialState: { fileTotalCount: 0, fileUploadPercentage: 0 },
  reducers: {
    setFileTotalCount: (state, action) => {
      state.fileTotalCount = action.payload;
    },
    setFileUploadPercentage: (state, action) => {
      state.fileUploadPercentage = action.payload;
    },
  },
});

export const { setFileTotalCount, setFileUploadPercentage } =
  uploadSlice.actions;
export default uploadSlice.reducer;
