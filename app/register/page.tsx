"use client";
import { signOut } from "next-auth/react";
import React, { useState, useEffect } from "react";
import CooldownButton from "@/components/button/CooldownButton";
const register: React.FC = () => {
  //輸入窗
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [verification, setVerification] = useState("");
  const [name, setname] = useState("");

  //信箱密碼錯誤檢測
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //彈窗
  // true 綠色,false 紅色
  const [showToastColor, setshowToastColor] = useState(false);
  const [verificationMessage, setverificationMessage] = useState("");
  const [showToast, setshowToast] = useState(false);
  //改善SSR渲染問題
  const [isClient, setIsClient] = useState(false);

  //設置animation
  const [emailAnimation, setemailAnimation] = useState(false);
  const [passwordAnimation, setpasswordAnimation] = useState(false);
  const [codeAnimation, setcodeAnimation] = useState(false);
  const [nameAnimation, setnameAnimation] = useState(false);
  useEffect(() => {
    setIsClient(true); // 標記為客戶端
  }, []);

  //emaill 驗證
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let emailError = "";
      function checkError(errorMessage: string, message: string): string {
        return errorMessage ? errorMessage : message;
      }
      const emailLength = email.split("@")[0];
      if (emailLength.length > 64 || emailLength.length < 3) {
        emailError = checkError(emailError, "email長度應該 3 到 64 字元之間");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        emailError = checkError(emailError, "email格式錯誤");
      }

      const illegalCharRegex = /[^a-zA-Z0-9@._-]/;
      if (illegalCharRegex.test(email)) {
        emailError = checkError(emailError, "Email 包含非法字元");
      }
      if (email == "") {
        setEmailError("");
      } else if (emailError) {
        setEmailError(emailError);
      } else {
        setEmailError("");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  //password 驗證
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let passwordError = "";

      function checkError(errorMessage: string, message: string): string {
        return errorMessage ? errorMessage : message;
      }

      if (password.length > 30 || password.length < 3) {
        passwordError = checkError(
          passwordError,
          "密碼長度應該 8 到 30 字元之間"
        );
      }
      const containLetter = /^(?=.*[a-zA-Z]).*$/;
      if (!containLetter.test(password)) {
        console.log(password);
        passwordError = checkError(passwordError, "應該包含一個大寫或小寫!");
      }

      const passwordNumber = /^(?=.*\d).*$/;
      if (!passwordNumber.test(password)) {
        passwordError = checkError(passwordError, "應該包含一個數字");
      }

      const illegalCharRegex = /[^ -~]/;
      if (illegalCharRegex.test(password)) {
        passwordError = checkError(passwordError, "密碼包含非法字符");
      }

      const dangerousCharsRegex = /[<>&'"]/;
      if (dangerousCharsRegex.test(password)) {
        passwordError = checkError(passwordError, "密碼包含不允許的字符");
      }

      if (password == "") {
        setPasswordError("");
      } else if (passwordError) {
        setPasswordError(passwordError);
      } else {
        setPasswordError("");
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [password]);

  //驗證信後端寄出彈窗
  useEffect(() => {
    setTimeout(() => {
      if (showToast) {
        setshowToast(false);
      }
    }, 2000);
  }, [showToast]);

  //寄出驗證信
  const emailAuthentication = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WEBSIDE_URL}/api/register/emailAuthentication`,
      {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: email,
      }
    );

    if (response.ok) {
      setshowToastColor(true);
      setverificationMessage("驗證信已寄出");
      setshowToast(true);
    } else {
      setshowToastColor(false);
      setverificationMessage("驗證信寄出失敗");
      setshowToast(true);
    }
  };

  //註冊送出
  const registerOnload = async () => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!.*[<>&'"])[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;
    const codeRegex = /^\d{6}$/;
    const nameRegex =
      /^[a-zA-Z\u00C0-\u017F\u4e00-\u9fa5\u0600-\u06FF\u0400-\u04FF·\-\s]{1,50}$/;

    if (
      emailRegex.test(email) &&
      passwordRegex.test(password) &&
      codeRegex.test(verification) &&
      nameRegex.test(name)
    ) {
      const result = { email, password, code: verification, name: name };
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSIDE_URL}/api/register/emailAuthentication`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(result),
          }
        );
        if (response.ok) {
          signOut({ callbackUrl: "/signin" });
        } else {
          setshowToastColor(false);
          setverificationMessage("伺服器內部錯誤，請重新送出");
          setshowToast(true);
        }
      } catch (error) {
        console.error("register page error on registerOnload function:", error);
      }
    } else {
      //視窗震動
      // const result = { email, password, code: verification };
      // console.log(JSON.stringify(result));
      if (!emailRegex.test(email)) {
        if (!emailAnimation) {
          setemailAnimation(true);
        } else {
          setemailAnimation(false);
        }
      }
      if (!passwordRegex.test(password)) {
        if (!passwordAnimation) {
          setpasswordAnimation(true);
        } else {
          setpasswordAnimation(false);
        }
      }
      if (!codeRegex.test(verification)) {
        if (!codeAnimation) {
          setcodeAnimation(true);
        } else {
          setcodeAnimation(false);
        }
      }
      if (!nameRegex.test(name)) {
        if (!nameAnimation) {
          setnameAnimation(true);
        } else {
          setnameAnimation(false);
        }
      }
    }
  };

  //關閉視窗震動 動畫啟動在送出表單

  return (
    <div className="flex items-center  mx-auto sm:w-[80%] m-5 ">
      {/*驗證碼提示窗*/}
      {showToast && (
        <div
          className={`fixed  top-16 left-1/2 transform -translate-x-1/2 translate-y-5 ${showToastColor ? " bg-green-500" : "bg-red-500"}rounded-lg p-1  transition-all op duration-150 ${showToast ? "opacity-100 translate-y-0" : ""}`}
        >
          {verificationMessage}
        </div>
      )}
      {isClient && (
        <div className="mx-auto my-4 w-[90%] p-3 rounded-lg border-black border-2 bg-gray-300">
          <form onSubmit={registerOnload} className="flex flex-col">
            <label
              htmlFor="email-input"
              className={`flex m-1  pl-2 bg-white rounded-lg overflow-hidden  border-2 border-black shadow ${emailAnimation ? " border-red-600 border-2 animate-shake" : ""}`}
              onAnimationEnd={() => setemailAnimation(false)}
            >
              信箱:
              <input
                type="email"
                id="email-input"
                className="grow ml-2 outline-none"
                value={email}
                placeholder="請輸入信箱"
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </label>
            {/*信箱錯誤資訊提示窗*/}
            {emailError && (
              <div className=" mx-auto text-red-500">{emailError}</div>
            )}
            <label
              htmlFor="password-input"
              className={`flex m-1 pl-2 rounded-lg overflow-hidden bg-white border-2 border-black ${passwordAnimation ? " border-red-600 border-2 animate-shake" : ""}`}
              onAnimationEnd={() => setpasswordAnimation(false)}
            >
              密碼:
              <input
                type="password"
                id="password-input"
                value={password}
                autoComplete="current-password"
                placeholder="請輸入密碼"
                className="grow ml-2 focus:outline-none "
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
              />
            </label>
            {/*信箱錯誤資訊提示窗*/}
            {passwordError && (
              <div className=" mx-auto text-red-500">{passwordError}</div>
            )}

            <div>
              <label
                htmlFor="name-input"
                className={`flex m-1 pl-2 rounded-lg overflow-hidden bg-white border-2 border-black ${nameAnimation ? " border-red-600 border-2 animate-shake" : ""}`}
                onAnimationEnd={() => setnameAnimation(false)}
              >
                姓名:
                <input
                  type="text"
                  id="name-input"
                  value={name}
                  placeholder="請輸入姓名"
                  className="grow ml-2 focus:outline-none "
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
              </label>
            </div>
            <div
              className={`m-1 bg-white rounded-lg border-solid overflow-hidden flex flex-col border-2 border-black md:flex-row shadow ${codeAnimation ? " border-red-600 border-2 animate-shake" : ""}`}
              onAnimationEnd={() => setcodeAnimation(false)}
            >
              <label htmlFor="verification" className="flex pl-2">
                信箱驗證碼:
              </label>
              <input
                type="text"
                id="verification"
                placeholder="請輸入6位驗證碼"
                className="grow mx-2 focus:outline-none"
                value={verification}
                onChange={(e) => {
                  setVerification(e.target.value);
                }}
              />
              {/* <button type="button" className="px-2 bg-green-400">
                取得信箱驗證碼
              </button> */}
              <CooldownButton
                onResend={emailAuthentication}
                normalLabel="取得信箱驗證碼"
                className="px-2 bg-green-400"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                registerOnload();
              }}
              className="flex justify-center bg-green-400 rounded-lg mx-auto w-16 mt-1 shadow"
            >
              送出
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default register;
