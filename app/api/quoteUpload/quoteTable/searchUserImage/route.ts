import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/utils/appRouter/api/auth/auth-config";
import path from "path";
import {
  checkOrCreateFolder,
  getContentTypeByExtension,
} from "@/utils/module-utils/fsUtility/fsUtil";
import fs from "fs";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    //* 驗證登入
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    if (!session.user || !session.user.id) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 403 }
      );
    }

    //* 檢查使用者目錄存在
    const userID = session.user.id;
    const UUID = req.nextUrl.searchParams.get("UUID");
    const fileString = req.nextUrl.searchParams.get("file");
    //* 檢查UUID
    if (!UUID || typeof UUID !== "string") {
      return NextResponse.json(
        { message: "Invalid UUID/無效UUID" },
        { status: 404 }
      );
    }
    //* 檢查檔名
    if (!fileString || typeof fileString !== "string") {
      return NextResponse.json(
        { message: "Invalid file name/無效檔案名稱" },
        { status: 404 }
      );
    }

    const fileDirPath = path.join(
      process.cwd(),
      "src",
      "Data",
      "User",
      userID,
      UUID,
      fileString
    );
    //* 檢查檔案存在
    const checkDir = await checkOrCreateFolder(fileDirPath, false);
    if (checkDir === false) {
      return NextResponse.json(
        {
          message: "查無圖片/no user image found",
        },
        { status: 404 }
      );
    }

    //* 獲取檔案副檔名
    const contentType = await getContentTypeByExtension(fileDirPath);
    if (!contentType) {
      return NextResponse.json(
        {
          message: "查無圖片/no user image found",
        },
        { status: 404 }
      );
    }

    const fileStream = fs.createReadStream(fileDirPath);

    return new NextResponse(fileStream as any, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
