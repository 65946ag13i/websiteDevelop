import { useMemo } from 'react';
import React from 'react';
export default function PaginationButton({
  page = 1, //+ 當前頁數
  setPage, //+ 設定頁數
  totalCount = 1, //+
  pageRowLength = 10, //+ 每頁顯示的資料數量
}: {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalCount: number;
  pageRowLength?: number;
}) {
  const MaxPages = useMemo(() => {
    return Math.ceil(totalCount / pageRowLength);
  }, [totalCount, pageRowLength]);

  const pagination = useMemo(() => {
    const pagesResult: number[] = [];
    //+ 列印到最大頁數,如果少於五頁
    if (MaxPages < 5) {
      for (let i = 0; i < MaxPages; i++) {
        pagesResult.push(i + 1);
      }
      //+ 如果目前頁面大於等於4頁,則從目前頁面"往前"兩頁 到 "往後"兩頁 列印
    } else if (page >= 4 && page < MaxPages - 2 && MaxPages > 5) {
      for (let i = page - 2; i < page + 3; i++) {
        pagesResult.push(i);
      }
      //+ 如果目前頁面大於等於最大頁數-2,則從最大頁數-4頁列印到最大頁數
    } else if (page >= MaxPages - 2) {
      for (let i = MaxPages - 4; i <= MaxPages; i++) {
        pagesResult.push(i);
      }
    } else {
      pagesResult.push(1);
    }

    return pagesResult;
  }, [page, MaxPages]);

  return (
    <div className="m-2">
      {page <= 4 ? (
        <div>
          {pagination.map((number) => {
            return (
              <button
                className={`${page === number ? 'bg-amber-200' : 'bg-slate-400'} m-2 min-w-7 rounded-lg px-2`}
                onClick={() => setPage(number)}
                key={`pagination-${number}`}
              >
                {number}
              </button>
            );
          })}
        </div>
      ) : page >= 4 && page < MaxPages - 2 ? (
        <div>
          {/*
          //* 顯示範例  1﹉ 2 3 4 5﹉ 6
          */}
          <button
            className="m-2 min-w-7 rounded-lg bg-slate-400 px-2"
            onClick={() => setPage(1)}
            key={`pagination-1`}
          >
            1
          </button>
          <div>﹉</div>
          {pagination.map((number) => {
            return (
              <button
                className={`${page === number ? 'bg-amber-200' : 'bg-slate-400'} m-2 min-w-7 rounded-lg px-2`}
                onClick={() => setPage(number)}
                key={`pagination-${number}`}
              >
                {number}
              </button>
            );
          })}
          <div>﹉</div>
          <button
            className="bg-slate-400"
            onClick={() => setPage(MaxPages)}
            key={`pagination-${MaxPages}`}
          >
            {MaxPages}
          </button>
        </div>
      ) : (
        <div>
          {/*
          //+ 顯示範例 1 ﹉ 2345
          */}
          <button
            className="bg-slate-400"
            onClick={() => setPage(1)}
            key={`pagination-1`}
          >
            1
          </button>
          <div>﹉</div>
          {pagination.map((number) => {
            return (
              <button
                className={`${page === number ? 'bg-amber-200' : 'bg-slate-400'}`}
                onClick={() => setPage(number)}
                key={`pagination-${number}  m-2 px-2 rounded-lg min-w-7`}
              >
                {number}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
