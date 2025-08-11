"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import NewQuote from "@/components/app/quote/NewQuote";
import { signOut, useSession } from "next-auth/react";
import ChangePassword from "@/components/app/quote/ChangePassword";
import QuoteTableServer from "@/components/app/quote/QuoteTable/QuoteTableServer";
const repairPage: React.FC = () => {
  //~----前言開關-----
  const [isOpen, setOpen] = useState(true); //前言
  const toggleAccordion = () => {
    setOpen(!isOpen);
  };
  //~----前言開關-----
  const [page, setPage] = useState<string>("newQuote");

  const pageNavigate = (currentPage: String) => {
    if (page != currentPage && currentPage) setPage(page);
  };

  const { data, status } = useSession();

  return (
    <div className="flex flex-col  justify-center w-full sm:w-[90%]  min-h-screen ">
      {"unauthenticated" === status ? (
        <div className="flex flex-col items-center m-2">
          <div className="m-2 p-1 ">使用報價系統請先登入</div>
          <div>
            <Link
              href="/signin"
              className="p-1 m-2 border-2 border-gray-900 rounded-lg shadow"
            >
              登入
            </Link>
            <Link
              href="/register"
              className="p-1 m-2 border-2 border-gray-900 rounded-lg shadow"
            >
              註冊
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div
            data-mark="前言塊"
            className="max-w-lg mx-auto border-2 border-gray-900 overflow-hidden rounded m-2 p-2 shadow"
          >
            <div
              className="text-center border-b-2 border-gray-400 "
              onClick={toggleAccordion}
            >
              ▼ 通知 ▼
            </div>

            <div
              className={`overflow-hidden text-start ${isOpen ? "max-h-full" : "max-h-0"}`}
            >
              夏季工作較忙報價通常需7個工作天 <br />
              老闆工作繁忙時，無法馬上報價 <br />
              如太久沒報價請再通知老闆報價
            </div>
          </div>

          <div
            data-mark="報價模塊"
            className="flex-col sm:inline-flex sm:flex-row  sm:w-full sm: rounded overflow-hidden shadow m-2 border-gray-900 border-2"
          >
            <div className="text-center border-b-2 sm:w-1/5 sm:border-b-0 sm:border-r-2 border-gray-900 ">
              <div className="flex  justify-center  sm:justify-normal sm:inline-flex sm:flex-col p-2">
                <button
                  onClick={() => pageNavigate("newQuote")}
                  className="p-1 m-1  border-2 border-gray-900 rounded-lg shadow"
                >
                  新估價
                </button>
                <button
                  onClick={() => pageNavigate("QuoteTableServer")}
                  className="p-1 m-1 border-2 border-gray-900 rounded-lg shadow"
                >
                  歷史估價
                </button>
                <button
                  onClick={() => pageNavigate("newQChangePassworduote")}
                  className="p-1 m-1 border-2 border-gray-900 rounded-lg shadow"
                >
                  修改密碼
                </button>
                <button
                  onClick={() => signOut()}
                  className="p-1 m-1 border-2  border-gray-900 rounded-lg shadow"
                >
                  登出
                </button>
              </div>
            </div>
            <div className="text-center  sm:w-4/5  bg-gray-100 ">
              {page === "newQuote" && <NewQuote />}
              {page === "ChangePassword" && <ChangePassword />}
              {page === "QuoteTableServer" && <QuoteTableServer />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default repairPage;
