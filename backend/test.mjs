import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const asd = path.join(__dirname, "/*.ts"); // 實體列表
console.log("地址是:" + asd);
console.log("地址是:" + __dirname);
