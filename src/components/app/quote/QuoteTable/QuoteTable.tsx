//接口 接收API
//刷新table

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import PaginationBtuuon from "@/components/public/PaginationButton";
import { searchUserQuote, searchUserQuoteTable } from "./QuoteTableServices";
interface Order {
  id: number;
  date: string;
  state: string;
  userId: number;
}

const QuoteTable = ({
  setUserUUID,
  setShouldFetch,
  setFunctionSwitch,
}: {
  setUserUUID: React.Dispatch<React.SetStateAction<string>>;
  setShouldFetch: React.Dispatch<React.SetStateAction<boolean>>;
  setFunctionSwitch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // const { data: session, status } = useSession();

  // if (status === "unauthenticated" || !session?.user?.id) {
  //   return <div>尚未登入</div>;
  // }

  //* 查詢報價單資料

  const search = async (userQuoteUUId: string) => {
    //+ 啟動useQury 撈資料
    setUserUUID(userQuoteUUId); //+ 傳送UUD給後端查詢
    setShouldFetch(true);
    //+ 切換頁面
    setFunctionSwitch("UserQuote");
  };

  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState<Number | null>(null);
  const [userData, setUserData] = useState<Order[]>([]);

  const { data } = useQuery({
    queryKey: ["order", page],
    queryFn: () => search(page.toString()),
  });

  if (!userData || userData.length < 1) {
    return <div>查無資料</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>編號</td>
            <td>建立日期</td>
            <td>處理狀態</td>
            <td>報價查詢</td>
          </tr>
        </thead>
        <tbody>
          {userData.map((order) => (
            <tr>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.state}</td>
              <td>
                <button onClick={() => search(order.id.toString())}>
                  查找
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationBtuuon page={page} maxDataLength={page} />
    </div>
  );
};

export default QuoteTable;
