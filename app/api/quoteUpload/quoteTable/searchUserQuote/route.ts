import { authOptions } from "@/utils/appRouter/api/auth/auth-config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { initDataSourse } from "@/backend/data-source";
import { userQuote } from "@/backend/entities/userQuote";
import {
  checkOrCreateFolder,
  sanitizeInput,
  readDirectoryImages,
} from "@/utils/module-utils/fsUtility/fsUtil";
import { get } from "http";

export async function GET(request: NextRequest) {
  try {
    //* 驗證登入
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!session.user || !session.user.id) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 400 }
      );
    }

    //* 檢查使用者目錄存在
    const userID = session.user.id;
    const fileDirPath = path.join(process.cwd(), "src", "Data", "User", userID);
    const checkDir = await checkOrCreateFolder(fileDirPath, false);
    if (checkDir === false) {
      return NextResponse.json(
        {
          message: "查無使用者目錄/no user directory found",
        },
        { status: 500 }
      );
    }

    //* 取得訂單UUID
    const quoteUUID = request.nextUrl.searchParams.get("quoteUUID");
    if (!quoteUUID || typeof quoteUUID !== "string") {
      return NextResponse.json(
        { message: "Invalid quote ID/無效ID" },
        { status: 400 }
      );
    }

    //* 檢查UUID目錄存在
    const sanitizeUUID = sanitizeInput(quoteUUID);
    const uuidDirPath = path.join(fileDirPath, sanitizeUUID);
    const checkUUIDDir = await checkOrCreateFolder(uuidDirPath, false);
    if (checkUUIDDir === false) {
      return NextResponse.json(
        {
          message: "查無UUID目錄/no UUID directory found",
        },
        { status: 500 }
      );
    }

    //*取得資料夾檔案名稱
    const images = await readDirectoryImages(uuidDirPath);
    if (images.length === 0) {
      return NextResponse.json(
        { message: "No images found/無圖片" },
        { status: 404 }
      );
    }

    const getDataSourse = await initDataSourse();
    const userData = await getDataSourse
      .getRepository(userQuote)
      .createQueryBuilder("uq")
      .where("uq.UUID = :uuid", { uuid: sanitizeUUID })
      .andWhere("uq.userID=:userID", { userID: userID })
      .getOne();

    if (!userData) {
      return NextResponse.json(
        { message: "No data found/查無資料" },
        { status: 404 }
      );
    }

    return NextResponse.json({ images, userData }, { status: 200 });
  } catch (error) {
    console.error("Error in SearchUserQuote GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
