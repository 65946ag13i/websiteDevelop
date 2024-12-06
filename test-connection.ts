import { DataSource } from "typeorm";
import { initDataSource } from "./backend/entities/data-source"; // 替換為你的 data source 檔案路徑

async function testConnection() {
  try {
    await initDataSource();
    console.log("資料庫連接成功");
  } catch (error) {
    console.error("資料庫連接失敗", error);
  }
}

testConnection();
