import { NextRequest, NextResponse } from 'next/server';
import { initDataSourse } from '@/backend/data-source';
import { User } from '@/backend/entities/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/appRouter/api/auth/auth-config';
import bcrypt from 'bcrypt';
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: '帳號未驗證/Unauthrized' },
        { status: 401 }
      );
    }
    interface password {
      currentPassword: string;
      newPassword: string;
    }

    const { currentPassword, newPassword }: password = await req.json();

    const userEmail = session?.user.email;
    if (typeof userEmail === 'string' && userEmail) {
      const getDataSourse = await initDataSourse();
      const userRepository = await getDataSourse.getRepository(User);
      const userData = await userRepository.findOne({
        select: ['email', 'password'],
        where: { email: userEmail },
      });

      const passwordRegex =
        /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;

      if (
        !userData ||
        !userData.password ||
        !passwordRegex.test(newPassword) ||
        !passwordRegex.test(currentPassword)
      ) {
        return NextResponse.json(
          { message: '找不到資料/Not Found' },
          { status: 404 }
        );
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        userData.password
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { message: '找不到資料/Not Found' },
          { status: 404 }
        );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      userData.password = hashedNewPassword;
      await userRepository.save(userData);

      return NextResponse.json({ message: 'Created' }, { status: 201 });
    } else {
      return NextResponse.json(
        { message: '找不到資料/Not Found' },
        { status: 404 }
      );
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error caught:', e.message);
      return NextResponse.json({ message: '伺服器發生錯誤' }, { status: 500 });
    } else {
      console.error('Unknown error caught:', e);
      return NextResponse.json({ message: '伺服器發生錯誤' }, { status: 500 });
    }
  }
}
