//

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCooldownCallback } from "@/utils/useHook/useDebounceCallback";
//

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [checkPassword, setCheckPassword] = useState("");
  const [severMessage, setSeverMessage] = useState("");
  //* 確認密碼
  const [passwordIsVailad, setPasswordIsVailad] = useState<boolean>(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  //~ 密碼驗證
  const passwordRegexCheck = () => {
    const passwordRegex =
      /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;
    //* 驗證整體密碼
    if (!newPassword) {
      setPasswordIsVailad(true); //+ 關閉提示

      return;
    } else if (passwordRegex.test(newPassword)) {
      setPasswordIsVailad(true); //+ 關閉提示

      return;
    } else {
      setPasswordIsVailad(false); //+ 打開提示
    }

    if (newPassword.length > 30 || newPassword.length < 8) {
      setPasswordErrorMessage("密碼長度應該 8 到 30 字元之間");
      return;
    }

    const containLetter = /^(?=.*[a-zA-Z]).*$/;
    if (!containLetter.test(newPassword)) {
      setPasswordErrorMessage("應該包含一個大寫或小寫!");
      return;
    }

    const passwordNumber = /^(?=.*\d).*$/;
    if (!passwordNumber.test(newPassword)) {
      setPasswordErrorMessage("應該包含一個數字");
      return;
    }

    const illegalCharRegex = /[^ -~]/;
    if (illegalCharRegex.test(newPassword)) {
      setPasswordErrorMessage("密碼包含非法字符");
      return;
    }

    const dangerousCharsRegex = /[<>&'"]/;
    if (dangerousCharsRegex.test(newPassword)) {
      setPasswordErrorMessage("密碼包含不允許的字符");
      return;
    }

    setPasswordErrorMessage("");
  };
  useEffect(() => {
    const passworVailadTimer = setTimeout(() => {
      passwordRegexCheck();
    }, 900);

    return () => {
      clearTimeout(passworVailadTimer);
    };
  }, [newPassword]);
  //~ 密碼驗證

  //~ 密碼相同確認
  //* 密碼相同確認
  const [passwordIsSame, setPasswordIsSame] = useState<boolean>(false);

  //* 密碼相同確認
  const checkPasswordFC = () => {
    //+ 新密碼 與 確認密碼 相同 ， 排除新舊空字串
    console.log(newPassword === checkPassword);
    if (!newPassword && !checkPassword) {
      setPasswordIsSame(false); //+ 關閉錯誤
    } else if (newPassword === checkPassword) {
      setPasswordIsSame(false); //+ 關閉錯誤
    } else {
      setPasswordIsSame(true); //+ 打開錯誤
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkPasswordFC();
    }, 900);

    return () => {
      clearTimeout(timer);
    };
  }, [checkPassword, newPassword]);
  //~ 密碼相同確認

  //* 提交表單
  const submitTheForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;
    if (
      passwordIsSame &&
      passwordIsVailad &&
      passwordRegex.test(currentPassword)
    ) {
      try {
        const passwordData = { currentPassword, newPassword };

        const result = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSIDE_URL}/api/quoteUpload/changePassword`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(passwordData),
          }
        );

        if (result.ok) {
          signOut({ callbackUrl: "/signin" });
        } else {
          setSeverMessage("伺服器發生錯誤，請重新上傳");
        }
      } catch (error) {
        console.error(
          "quote change password page error on submitTheForm function:",
          error
        );
      }
    } else {
      setPasswordCheck(true);
    }
  };

  const sendFrom = useCooldownCallback(submitTheForm, 1000);

  const [passwordCheck, setPasswordCheck] = useState<Boolean>(false);

  return (
    <div className="mt-2">
      {severMessage ? severMessage : null}
      <form
        onSubmit={sendFrom}
        className="grid grid-cols-[auto,1fr] grid-rows-7"
      >
        <label
          htmlFor="password"
          className="my-1 flex items-center justify-center"
        >
          輸入密碼:
        </label>
        <input
          type="text"
          id="password"
          onChange={(e) => setCurrentPassword(e.target.value)}
          className=" leading-3 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
         placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 
         focus:border-blue-500 sm:text-sm  my-1 mx-2"
        />

        <label
          htmlFor="newPassword"
          className="my-1 flex items-center justify-center"
        >
          輸入新密碼:
        </label>
        <input
          type="text"
          id="newPassword"
          className=" leading-3 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
         placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 
         focus:border-blue-500 sm:text-sm my-1 mx-2"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {passwordIsVailad ? null : (
          <div className=" text-red-600 col-span-2">{passwordErrorMessage}</div>
        )}

        <label
          htmlFor="confirmPassword"
          className="my-1 flex items-center justify-center"
        >
          再次輸入新密碼:
        </label>
        <input
          type="text"
          id="confirmPassword"
          onChange={(e) => {
            setCheckPassword(e.target.value);
          }}
          className=" leading-3 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
         placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 
         focus:border-blue-500 sm:text-sm my-1 mx-2"
        />
        {passwordIsSame ? (
          <div className=" text-red-600 col-span-2 flex items-center justify-center">
            新密碼和確認新密碼不相同
          </div>
        ) : null}
        {passwordCheck ? (
          <div className=" text-red-600 col-span-2 flex items-center justify-center">
            請重新確認舊密碼和密碼是否符合需求
          </div>
        ) : null}

        <button
          type="submit"
          className="col-span-2 my-3 mx-auto px-2 bg-green-300 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          送出
        </button>
      </form>
    </div>
  );
};
export default ChangePassword;
