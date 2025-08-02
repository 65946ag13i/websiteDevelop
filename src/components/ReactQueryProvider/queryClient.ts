// queryClient.ts
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const queryConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
};

let clientQueryClient: QueryClient | undefined = undefined;

export const getClientQueryClient = () => {
  if (typeof window === "undefined") {
    // 伺服器端：返回新實例
    return new QueryClient(queryConfig);
  } else {
    // 客戶端：返回單例
    if (!clientQueryClient) {
      clientQueryClient = new QueryClient(queryConfig);
    }
    return clientQueryClient;
  }
};

// 伺服器端實例 (自動緩存)
export const getServerQueryClient = cache(() => new QueryClient(queryConfig));
