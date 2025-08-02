import QuoteTable from "@/components/app/quote/QuoteTable/QuoteTable";
import UserQuote from "@/components/app/quote/QuoteTable/UserQuote";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const QuoteFunctionSwitch: React.FC = () => {
  const [functionSwitch, setFunctionSwitch] = useState("QuoteTable");
  const [userUUID, setUserUUID] = useState("");
  const [shouldFetch, setShouldFetch] = useState(Boolean);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["userQuote", userUUID],
    enabled: shouldFetch && !!userUUID,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setShouldFetch(false); // 得到資料後取消資料獲取
    }
  }, [isSuccess]);

  return (
    <>
      {functionSwitch === "QuoteTable" ? (
        <QuoteTable
          setUserUUID={setUserUUID} //* 啟動useQuery 撈資料
          setShouldFetch={setShouldFetch} //* 啟動useQuery撈資料
          setFunctionSwitch={setFunctionSwitch} //* 目前功能為切換頁面
        ></QuoteTable>
      ) : (
        <UserQuote
          isLoading={isLoading}
          data={data}
          setFunctionSwitch={setFunctionSwitch}
          UUID={userUUID}
        ></UserQuote>
      )}
    </>
  );
};
