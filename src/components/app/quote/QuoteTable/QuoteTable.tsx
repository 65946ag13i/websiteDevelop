//接口 接收API
//刷新table

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import PaginationBtuuon from "@/components/public/PaginationButton";
import { searchUserQuoteTable } from "./QuoteTableServices";
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

  //* 查詢指定報價單
  const search = async (userQuoteUUId: string) => {
    //+ 啟動useQury 撈資料
    setUserUUID(userQuoteUUId); //+ 傳送UUD給後端查詢
    setShouldFetch(true);
    //+ 切換頁面
    setFunctionSwitch("UserQuote");
  };

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userData, setUserData] = useState<Order[]>([]);

  interface Order {
    id: number;
    createdAt: string;
    state: number;
    UUID: string;
  }
  interface SearchResponse {
    data: Order[];
    totalCount: number;
  }

  const { data, isLoading, isError } = useQuery<SearchResponse>({
    queryKey: ["order", page],
    queryFn: () => searchUserQuoteTable(page.toString()),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (
    isError ||
    !data ||
    !data.data ||
    data.data.length < 1 ||
    !data.totalCount
  ) {
    return <div>查無資料</div>;
  }

  setUserData(data.data);
  setTotalCount(data.totalCount);
  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>編號</td>
            <td>建立日期</td>
            <td>處理狀態</td>
            <td>報價單查詢</td>
          </tr>
        </thead>
        <tbody>
          {userData.map((order) => (
            <tr>
              <td>{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.state}</td>
              <td>
                <button onClick={() => search(order.UUID.toString())}>
                  查找
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationBtuuon page={page} totalCount={totalCount} setPage={setPage} />
    </div>
  );
};

export default QuoteTable;
