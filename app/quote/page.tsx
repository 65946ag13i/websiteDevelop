'use client';
import { useState } from 'react';
import Link from 'next/link';
import NewQuote from '@/components/app/quote/NewQuote';
import { signOut, useSession } from 'next-auth/react';
import ChangePassword from '@/components/app/quote/ChangePassword';
import QuoteTableServer from '@/components/app/quote/QuoteTable/QuoteTableServer';
const Quote = () => {
  //~----前言開關-----
  const [isOpen, setOpen] = useState(true); //前言
  const toggleAccordion = () => {
    setOpen(!isOpen);
  };
  //~----前言開關-----
  const [page, setPage] = useState<string>('newQuote');

  const pageNavigate = (currentPage: string) => {
    // console.log(page);
    // console.log(currentPage);
    // console.log(page === currentPage);
    // console.log(page !== currentPage);
    if (page !== currentPage) setPage(currentPage);
  };

  const { status } = useSession();
  // console.log("使用者資料驗證");
  // console.dir(data, { depth: null });
  return (
    <div className="mt-2 flex min-h-screen w-full flex-col sm:w-[90%]">
      {'unauthenticated' === status ? (
        <div className="m-2 flex flex-col items-center">
          <div className="m-2 p-1">使用報價系統請先登入</div>
          <div>
            <Link
              href="/signin"
              className="m-2 rounded-lg border-2 border-gray-900 p-1 shadow"
            >
              登入
            </Link>
            <Link
              href="/register"
              className="m-2 rounded-lg border-2 border-gray-900 p-1 shadow"
            >
              註冊
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div
            data-mark="前言塊"
            className="m-2 mx-auto max-w-lg overflow-hidden rounded border-2 border-gray-900 p-2 shadow"
          >
            <div className="border-b-2 border-gray-400 text-center">
              <button onClick={toggleAccordion}>通知</button>
            </div>

            <div
              className={`overflow-hidden text-start ${isOpen ? 'max-h-full' : 'max-h-0'}`}
            >
              夏季工作較忙報價通常需7個工作天 <br />
              老闆工作繁忙時，無法馬上報價 <br />
              如太久沒報價請再通知老闆報價
            </div>
          </div>

          <div
            data-mark="報價模塊"
            className="sm: m-2 flex-col overflow-hidden rounded border-2 border-gray-900 shadow sm:inline-flex sm:w-full sm:flex-row"
          >
            <div className="border-b-2 border-gray-900 text-center sm:w-1/5 sm:border-b-0 sm:border-r-2">
              <div className="flex justify-center p-2 sm:inline-flex sm:flex-col sm:justify-normal">
                <button
                  onClick={() => pageNavigate('newQuote')}
                  className="m-1 rounded-lg border-2 border-gray-900 p-1 shadow"
                >
                  新估價
                </button>
                <button
                  onClick={() => pageNavigate('QuoteTableServer')}
                  className="m-1 rounded-lg border-2 border-gray-900 p-1 shadow"
                >
                  歷史估價
                </button>
                <button
                  onClick={() => pageNavigate('ChangePassword')}
                  className="m-1 rounded-lg border-2 border-gray-900 p-1 shadow"
                >
                  修改密碼
                </button>
                <button
                  onClick={() => signOut()}
                  className="m-1 rounded-lg border-2 border-gray-900 p-1 shadow"
                >
                  登出
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center bg-gray-100 text-center sm:w-4/5">
              {page === 'newQuote' && <NewQuote />}
              {page === 'QuoteTableServer' && <QuoteTableServer />}
              {page === 'ChangePassword' && <ChangePassword />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Quote;
