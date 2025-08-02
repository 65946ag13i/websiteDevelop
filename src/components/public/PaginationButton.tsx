import { useMemo } from "react";

export default function PaginationBtuuon({
  page = 1,
  maxDataLength = 1,
  pageRowLength = 10,
}: {
  page: number;
  maxDataLength: number;
  pageRowLength?: number;
}) {
  const MaxPages = Math.ceil(maxDataLength / pageRowLength);

  const pagination = useMemo(() => {
    const pagesResult: number[] = [];

    if (MaxPages < 5) {
      for (let i = 0; i < MaxPages + 1; i++) {
        pagesResult.push(i + 1);
      }
    } else if (page >= 4) {
      for (let i = page - 2; i < page + 3; i++) {
        pagesResult.push(i);
      }
    }

    return pagesResult;
  }, [page, maxDataLength]);

  return (
    <div>
      {page <= 4 ? (
        <div>
          {pagination.map((number) => {
            return (
              <button
                className={`${page === number ? "bg-amber-200" : "bg-slate-400"}`}
              >
                {number}
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <button>1</button>
          <div>﹉</div>
          {pagination.map((number) => {
            return (
              <button
                className={`${page === number ? "bg-amber-200" : "bg-slate-400"}`}
              >
                {number}
              </button>
            );
          })}
          <div>﹉</div>
          <button>{MaxPages}</button>
        </div>
      )}
    </div>
  );
}
