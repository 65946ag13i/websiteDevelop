import { NextRequest, NextResponse } from "next/server";
import sendEmailMiddleware from "@/utils/serverMailer";
import { VerificationCode } from "@/backend/entities/verification_codes";
import { initDataSourse } from "@/backend/data-source";
import { validate } from "class-validator";
export async function POST(req: NextRequest): Promise<NextResponse> {
  const getMail = await req.text();
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!.*[<>&'"])[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!getMail || !emailRegex.test(getMail)) {
    return NextResponse.json({ error: "驗證信寄出失敗" }, { status: 400 });
  }

  const {
    success,
    message,
    VerificationCode: code = null,
  }: {
    success: boolean; // 指定 success 為 boolean
    message: string;
    VerificationCode?: string | null; // 假設 VerificationCode 是可選的字串或 null
  } = await sendEmailMiddleware("TW", "verification", getMail); //寄驗證信
  if (!success) {
    console.error(message);
  }
  try {
    const setTime = 1800000; //驗證時間30分鐘
    if (success && code) {
      const getDataSourse = await initDataSourse(); //資料庫初始化
      //儲存使用者信箱驗證碼過期日期 到伺服器儲存 會週期清除
      const codeRepository =
        await getDataSourse.getRepository(VerificationCode);
      const newVerificationCode = new VerificationCode();
      newVerificationCode.code = code;
      newVerificationCode.email = getMail;
      newVerificationCode.expires_at = new Date(Date.now() + setTime);

      //資料驗證
      const errors = await validate(newVerificationCode);
      if (errors.length > 0) {
        return NextResponse.json(
          { message: "驗證信寄出失敗" },
          { status: 400 }
        );
      }
      await codeRepository.save(newVerificationCode);
      return NextResponse.json({ message: "驗證信已寄出" }, { status: 200 });
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error("Error caught:", e.message);
      return NextResponse.json({ message: "伺服器發生錯誤" }, { status: 500 });
    } else {
      console.error("Unknown error caught:", e);
      return NextResponse.json({ message: "伺服器發生錯誤" }, { status: 500 });
    }
  }

  return NextResponse.json({ message: "驗證信寄出失敗" }, { status: 400 });
}
