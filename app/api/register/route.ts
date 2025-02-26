import { NextRequest, NextResponse } from "next/server";
import { initDataSourse } from "@/backend/data-source";
import { User } from "@/backend/entities/User";
import { VerificationCode } from "@/backend/entities/verification_codes";
import { Between } from "typeorm";
import bcrypt from "bcrypt";
import { validate } from "class-validator";

interface loginVaild {
  email: string;
  password: string;
  code: string;
  name: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { email, password, code, name }: loginVaild = await req.json();

    if (!email || !password || !code || !name) {
      return NextResponse.json({ error: "資料沒有正確填寫" }, { status: 400 });
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!.*[<>&'"])[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;
    const codeRegex = /^\d{6}$/;
    const nameRegex =
      /^[a-zA-Z\u00C0-\u017F\u4e00-\u9fa5\u0600-\u06FF\u0400-\u04FF·\-\s]{1,50}$/;
    if (
      !emailRegex.test(email) ||
      !passwordRegex.test(password) ||
      !codeRegex.test(code) ||
      !nameRegex.test(name)
    ) {
      return NextResponse.json({ message: "驗證未通過" }, { status: 400 });
    }
    //信箱驗證
    const getDataSourse = await initDataSourse();
    const userRepository = await getDataSourse.getRepository(User);
    const userData = await userRepository.findOne({
      select: ["email"],
      where: { email },
    });
    if (userData) {
      return NextResponse.json({ messsage: "帳號已存在" }, { status: 400 });
    }
    //驗整碼驗證
    const setTime = 3600000; //一小時
    const codeDataSoruse = await getDataSourse.getRepository(VerificationCode);
    const timeStart = new Date();
    const timeEnd = new Date(timeStart.getTime() - setTime);
    const codedata = await codeDataSoruse.findOne({
      select: ["email", "code", "expires_at"],
      where: {
        created_at: Between(timeEnd, timeStart),
        email: email,
        code: code,
      },
    });
    if (codedata) {
      const hashPassword = await bcrypt.hash(password, 10); //加密
      const newUser = new User();
      newUser.name = name;
      newUser.email = email;
      newUser.password = hashPassword;

      const errors = await validate(newUser); //驗證資料
      if (errors.length > 0) {
        return NextResponse.json(
          { message: "驗證信寄出失敗" },
          { status: 400 }
        );
      }

      userRepository.save(newUser); //儲存資料
      return NextResponse.json({ messsage: "success" }, { status: 200 });
    } else {
      return NextResponse.json({ messsage: "帳號已存在" }, { status: 400 });
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
}
