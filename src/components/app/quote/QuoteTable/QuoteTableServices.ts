//* 尋找使用者表格
//* 直接驗證使用者後拿ID
//* 用ID 及 傳入的頁數做搜索報價
export const searchUserQuoteTable = async (page: string) => {
  const params = new URLSearchParams();
  params.append("page", page);

  const result = await fetch(
    `${process.env.WEBSIDE_URL}/api/quoteTable/searchUserQuoteTable?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return result;
};

//* 尋找使用者指定報價單
//* 查詢提交頁面後刷新組件到預覽
//* 直接驗證使用者後拿ID
//* 用ID 及 傳入的文章ID 做文章搜索
export const searchUserQuote = async (quoteUUID: string) => {
  const params = new URLSearchParams();
  params.append("quoteUUID", quoteUUID);

  //* 返回使用者文字報價單
  const result = await fetch(
    `${process.env.WEBSIDE_URL}/api/quoteTable/searchUserQuote?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!result.ok) {
    throw new Error("報價單請求失敗/quote network error");
  }

  //* 返回使用者報價單內的圖片地址

  return result.json();
};
