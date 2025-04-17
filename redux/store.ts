import { configureStore } from "@reduxjs/toolkit";
import uploadReducer from "./features/upload/uploadSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { upload: uploadReducer },
  });
};

export type AppStore = ReturnType<typeof makeStore>; //或 typeof store
export type RootState = ReturnType<AppStore["getState"]>; //或 ReturnType<typeof store.getState>
export type AppDispatch = AppStore["dispatch"]; //或 typeof store.dispatch
