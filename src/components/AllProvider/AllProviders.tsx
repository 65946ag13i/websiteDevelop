"use client";
import { ReduxProvider } from "@/components/ReduxProvider/ReduxProvider";
import ReactQueryProvider from "@/components/ReactQueryProvider/ReactQueryProvider";
import React from "react";
export const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReduxProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ReduxProvider>
  );
};
