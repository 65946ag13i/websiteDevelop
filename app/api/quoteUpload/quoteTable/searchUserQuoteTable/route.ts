import { initDataSourse } from "@/backend/data-source";
import { authOptions } from "@/utils/appRouter/api/auth/auth-config";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { userQuote } from "@/backend/entities/userQuote";
// app/api/hello/route.ts

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (
      !session.user ||
      !session.user.id ||
      typeof session.user.id !== "string"
    ) {
      return NextResponse.json(
        { message: "User ID not found in session" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const page = request.nextUrl.searchParams.get("page");

    if (!page || isNaN(Number(page))) {
      return NextResponse.json(
        { message: "Invalid page number" },
        { status: 400 }
      );
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = 10;
    const pagelimt = (pageNumber - 1) * pageSize; // 計算跳過的數量

    const getDataSourse = await initDataSourse();
    const [result, count] = await getDataSourse
      .getRepository(userQuote)
      .createQueryBuilder("uq")
      .select(["uq.id", "uq.createdAt", "uq.state", "uq.UUID"])
      .where("uq.userID=:userId", { userID: userId })
      .orderBy("uq.createdAt", "DESC")
      .skip(pagelimt) // 假設從第0頁開始
      .take(pageSize) // 假設每頁顯示10條數據
      .getManyAndCount();

    if (!result || result.length === 0) {
      return NextResponse.json(
        { message: "No quotes found for this user/找不到使用者資料" },
        { status: 404 }
      );
    }
    console.log("-----------");
    console.log("result", result);
    console.log("-----------");
    console.log("count", count);
    console.log("-----------");
    return NextResponse.json(
      { data: result, totalCount: count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
