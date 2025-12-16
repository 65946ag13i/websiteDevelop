"use client";
import { makeStore, AppStore } from "../../redux/store";
import { useRef } from "react";
import { Provider } from "react-redux";
import React from "react";
export const ReduxProvider = ({
  children,
  // initialData, // 可选的初始数据
}: {
  children: React.ReactNode;
  // initialData?: Partial<RootState>;
}) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // 单例模式创建 store
    storeRef.current = makeStore();

    // 如果有初始数据
    // storeRef.current.dispatch(initializeCount(initialData))
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
};
