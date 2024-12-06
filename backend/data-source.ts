import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { OAuth2List } from "./entities/OAuth2List";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// entities: [path.join(__dirname, "entities/*.ts")],
//以下動態載入實體
// import glob from 'glob';
// const entities = glob.sync(join(__dirname, 'entities/*.ts')).map((file) => require(file).default || require(file));

const getDataSource = new DataSource({
  type: "postgres",
  host: "localhost", // 本地資料庫地址
  port: 5432, // PostgreSQL 默認端口
  username: "postgres", // 你的 PostgreSQL 用戶名
  password: process.env.POSTGRESQL_SECRT, // 你的 PostgreSQL 密碼
  database: "homewebside", // 你的資料庫名稱
  synchronize: true, // 自動同步數據庫表結構 (生產環境中建議設置為 false)
  logging: true, // 啟用查詢日誌
  entities: [User, OAuth2List], // 實體列表
  migrations: ["src/migrations/*.ts"], // 遷移文件路徑
  subscribers: [],
  extra: {
    max: 20,
    m: 5,
    idleTimeoutMillis: 15000, // 闲置时间，单位为毫秒
  },
});

// 初始化數據源
export const initDataSource = async (): Promise<DataSource> => {
  if (!getDataSource.isInitialized) {
    try {
      await getDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during Data Source initialization:", err);
      throw err; // 明確拋出錯誤，以便捕獲
    }
  }
  return getDataSource;
};
