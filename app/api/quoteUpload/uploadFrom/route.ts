// 建立表單
//儲存文本資料 UUID, conditionerSelectedOption, bands, remarks
//檢查存在 建立使用者資料夾(先給我一個基本位置 我自行調整)
//建立UUID資料夾
import { initDataSourse } from "@/backend/data-source";
import { userQuote } from "@/backend/entities/userQuote";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/appRouter/api/auth/auth-config";

export async function POST(req: NextRequest) {
  try {
    //~ 使用者驗證
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "帳號未驗證/Unauthrized" },
        { status: 401 }
      );
    }
    const userID = session?.user.id;
    if (!userID) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 400 }
      );
    }

    //~ 使用者驗證

    //~ 驗證表單資料並儲存
    const formdata = await req.json();
    const dto = plainToClass(userQuote, formdata);
    const errors = await validate(dto);
    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Form data validation failed。" },
        { status: 400 }
      );
    }

    const DataSourse = await initDataSourse();
    const userSourse = await DataSourse.getRepository(userQuote);
    await userSourse.save(dto);
    //~ 驗證表單資料並儲存

    //~ 建立使用者資料夾 與 UUID資料夾 提供後續上傳圖片
    //+ UUIID資料夾拿來放圖片的
    const userDirPath = path.join(
      process.cwd(),
      "public",
      "Data",
      "User",
      userID,
      formdata.UUID
    );

    //*查找及建立使用者資料夾
    async function checkDirectory(dirPath: string) {
      try {
        await fs.access(dirPath); //查找是否有該位置
        console.log("已有目錄");
      } catch (error) {
        await fs.mkdir(dirPath, { recursive: true }).catch((err) => {
          console.error(`建立目錄失敗：${err}`);
          throw err;
        });
        console.log(`資料夾不存在，已建立：${dirPath}`);
      }
    }

    checkDirectory(userDirPath);
    //~ 建立使用者資料夾 與 UUID資料夾 提供後續上傳圖片
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("Session retrieval error:", error);
    return NextResponse.json({ message: "sever error" }, { status: 500 });
  }
}
