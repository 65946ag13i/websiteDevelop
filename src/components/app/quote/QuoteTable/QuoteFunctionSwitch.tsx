"use client";
import QuoteTable from "@/components/app/quote/QuoteTable/QuoteTable";
import UserQuote from "@/components/app/quote/QuoteTable/UserQuote";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUserQuote } from "./QuoteTableServices";
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
const QuoteFunctionSwitch: React.FC = () => {
  const [functionSwitch, setFunctionSwitch] = useState("QuoteTable");
  const [userUUID, setUserUUID] = useState("");
  // const [shouldFetch, setShouldFetch] = useState(false);
  const [quoteData, setQuoteData] = useState<Order | null>(null);
  //~ 給UserQuote使用
  const { data, isLoading } = useQuery({
    queryKey: ["userQuote", userUUID],
    queryFn: () => searchUserQuote(userUUID),
    enabled: !!userUUID,
  });

  // useEffect(() => {
  //   if (isSuccess && data) {
  //     setShouldFetch(false); // 得到資料後取消資料獲取
  //   }
  // }, [isSuccess, data, ]);
  //~ 給UserQuote使用
  console.log("switch");
  console.dir(data);
  return (
    <div>
      {functionSwitch === "QuoteTable" ? (
        <QuoteTable
          setUserUUID={setUserUUID} //* 啟動useQuery 撈資料
          // setShouldFetch={setShouldFetch} //* 啟動useQuery撈資料
          setFunctionSwitch={setFunctionSwitch} //* 目前功能為切換頁面
          setQuoteData={setQuoteData}
        ></QuoteTable>
      ) : (
        <UserQuote
          isLoading={isLoading}
          data={data}
          quoteData={quoteData}
          setFunctionSwitch={setFunctionSwitch}
          UUID={userUUID}
        ></UserQuote>
      )}
    </div>
  );
};

export default QuoteFunctionSwitch;
