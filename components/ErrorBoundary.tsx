"use client"; // 將該組件標記為客戶端組件

import React from "react";

// 定義錯誤邊界的 Props 和 State 類型
interface ErrorBoundaryProps {
  children: React.ReactNode; // 子組件
}

interface ErrorBoundaryState {
  hasError: boolean; // 是否發生錯誤
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false }; // 初始狀態：沒有錯誤
  }

  // 當子組件拋出錯誤時調用
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }; // 更新狀態以表示發生了錯誤
  }

  // 捕獲錯誤並記錄到控制台
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // 如果有錯誤，顯示備用 UI
      return <div>Something went wrong. Please try again later.</div>;
    }

    // 如果沒有錯誤，渲染子組件
    return this.props.children;
  }
}

export default ErrorBoundary;
