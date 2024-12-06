"use clinet";
import { createContext, useContext } from "react";

interface Session {
  user: {
    id: string; // 添加自定義屬性
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const SessionContext = createContext<Session | null>(null);

export const useSession = () => {
  return useContext(SessionContext);
};
