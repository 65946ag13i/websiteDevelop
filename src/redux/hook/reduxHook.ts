import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, RootState, AppStore } from "@/redux/store";

// 使用 .withTypes()（React-Redux v8.1.0+）
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
