//接口 接收API
//刷新table

import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import PaginationBtuuon from "@/components/public/PaginationButton";
import { searchUserQuoteTable } from "./QuoteTableServices";

interface Order {
  id: number;
  createdAt: string;
  state: string;
  UUID: string;
  conditionerSelectedOption: string[];
  brands: string;
  remarks: string;
  userid: number;
}

const QuoteTable = ({
  setUserUUID,
  // setShouldFetch,
  setFunctionSwitch,
  setQuoteData,
}: {
  setUserUUID: React.Dispatch<React.SetStateAction<string>>;
  // setShouldFetch: React.Dispatch<React.SetStateAction<boolean>>;
  setFunctionSwitch: React.Dispatch<React.SetStateAction<string>>;
  setQuoteData: React.Dispatch<React.SetStateAction<Order | null>>;
}) => {
  // const { data: session, status } = useSession();

  // if (status === "unauthenticated" || !session?.user?.id) {
  //   return <div>尚未登入</div>;
  // }

  //* 查詢指定報價單
  const search = async (userQuoteUUId: string, data: Order) => {
    console.log("測試");
    console.log(!!userQuoteUUId);
    //+ 啟動useQury 撈資料
    setUserUUID(userQuoteUUId); //+ 傳送UUD給useQuery,後端查詢
    setQuoteData(data);
    // setShouldFetch(true);

    //+ 切換頁面
    setFunctionSwitch("UserQuote");
  };

  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [userData, setUserData] = useState<Order[]>([]);

  interface Order {
    id: number;
    createdAt: string;
    state: string;
    UUID: string;
    conditionerSelectedOption: string[];
    brands: string;
    remarks: string;
    userid: number;
  }
  interface SearchResponse {
    data: Order[];
    totalCount: number;
  }

  const { data, isLoading, isError } = useQuery<SearchResponse>({
    queryKey: ["order", page],
    queryFn: () => searchUserQuoteTable(page.toString()),
  });

  useEffect(() => {
    if (data?.data) {
      setUserData(data.data);
    }
    if (data?.totalCount !== undefined) {
      setTotalCount(data.totalCount);
    }
  }, [data]);

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
    return <div className="text-red-500 text-xl">查無歷史資料</div>;
  }

  return (
    <div>
      <table className="border-2 border-black border-collapse table-auto mt-3 ">
        <thead
          className="bg-gray-300 border-2 border-black 
        [&_td]:border-2 [&_td]:border-black [&_td]:p-1.5 "
        >
          <tr>
            <td>編號</td>
            <td>建立日期</td>
            <td>處理狀態</td>
            <td>報價單查詢</td>
          </tr>
        </thead>
        <tbody>
          {userData.map((order, index) => (
            <tr
              key={`group-${order.id}`}
              className="even:bg-gray-300 border-2 border-black hover:bg-green-300 transition-colors duration-150 
              [&_td]:border-2 [&_td]:border-black [&_td]:p-1.5"
            >
              <td key={`row-${index}`}>{index + 1}</td>
              <td>
                {new Date(order.createdAt).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  // 秒不加，就不顯示
                })}
              </td>
              <td>{order.state === "Unfulfilled" ? "尚未處理" : "已處理"}</td>
              <td>
                <button onClick={() => search(order.UUID.toString(), order)}>
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
