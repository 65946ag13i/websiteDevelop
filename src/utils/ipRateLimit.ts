//內存方案在分布式系統無法使用，因為內存可能在A 或 B 系統中，所以不能使用
import { NextResponse } from "next/server";

// 全局 Map 用於存儲 IP 的請求數據
const ipRequestMap = new Map();

// 設定限制：10分鐘內最多200個請求
const MAX_REQUESTS = 200;
const TIME_WINDOW_MS = 10 * 60 * 1000; // 10分鐘

export async function middleware(req: NextResponse) {
  const ip = req.headers.get("x-forwarded-for") || "unknown-ip";

  // 獲取當前時間
  const now = Date.now();

  // 檢查或初始化 IP 的請求數據
  if (!ipRequestMap.has(ip)) {
    ipRequestMap.set(ip, { count: 0, lastRequestTime: now });
  }

  const ipData = ipRequestMap.get(ip);

  // 如果超過時間窗口，重置計數器
  if (now - ipData.lastRequestTime > TIME_WINDOW_MS) {
    ipData.count = 0;
    ipData.lastRequestTime = now;
  }

  // 檢查是否超過最大請求限制
  if (ipData.count >= MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // 更新請求計數
  ipData.count += 1;
  ipData.lastRequestTime = now;

  // 清理過期的 IP 數據（可選）
  cleanupExpiredIPs(now);

  // 繼續處理請求
  return NextResponse.next();
}

// 定期清理過期的 IP 數據
function cleanupExpiredIPs(currentTime: number) {
  for (const [ip, data] of ipRequestMap.entries()) {
    if (currentTime - data.lastRequestTime > TIME_WINDOW_MS) {
      ipRequestMap.delete(ip);
    }
  }
}
