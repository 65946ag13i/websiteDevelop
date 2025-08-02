//

import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

//

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [checkPassword, setcheCkPassword] = useState("");
  const [severMessage, setSeverMessage] = useState("");
  //* 確認密碼
  const [passwordIsVailad, setPasswordIsVailad] = useState<boolean>(true);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const passwordRegexCheck = () => {
    const passwordRegex =
      /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;
    //* 驗證整體密碼
    if (passwordRegex.test(newPassword)) {
      setPasswordIsVailad(true);
      return;
    } else {
      setPasswordIsVailad(false);
    }

    if (newPassword.length > 30 || newPassword.length < 3) {
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
    }, 1500);

    return () => {
      clearTimeout(passworVailadTimer);
    };
  }, [passwordIsVailad]);

  //* 密碼相同確認

  const [passwordIsSame, setPasswordIsSame] = useState<boolean>(false);

  const checkPasswordFC = () => {
    if (newPassword === checkPassword) {
      setPasswordIsSame(false);
    } else {
      setPasswordIsSame(true);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      checkPasswordFC();
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [checkPassword]);

  const submitTheForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordRegex =
      /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;
    if (
      passwordIsSame &&
      passwordIsVailad &&
      passwordRegex.test(currentPassword)
    ) {
      const passwordData = { currentPassword, newPassword };
      const result = await fetch(
        `${process.env.WEBSIDE_URL}/api/quoteUpload/changePassword`,
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
    }
  };
  return (
    <div>
      {severMessage ? severMessage : null}
      <form onSubmit={submitTheForm}>
        <label htmlFor="password">
          輸入密碼:
          <input
            type="text"
            id="password"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>
        <label htmlFor="newPassword">
          輸入新密碼:
          <input
            type="text"
            id="newPassword"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        {passwordIsVailad ? null : (
          <div className=" text-red-600 ">{passwordErrorMessage}</div>
        )}
        <label htmlFor="confirmPassword">
          再次輸入新密碼:
          <input
            type="text"
            id="confirmPassword"
            onChange={(e) => {
              setcheCkPassword(e.target.value);
            }}
          />
        </label>
        {passwordIsSame ? (
          <div className=" text-red-600 ">新密碼和確認新密碼不相同</div>
        ) : null}
        <button type="submit">送出</button>
      </form>
    </div>
  );
};
export default ChangePassword;
