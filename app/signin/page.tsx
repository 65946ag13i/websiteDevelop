"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const ComponentName: React.FC = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");
  const router = useRouter();

  //信箱密碼錯誤檢測
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  //設置animation
  const [emailAnimation, setemailAnimation] = useState(false);
  const [passwordAnimation, setpasswordAnimation] = useState(false);
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

  const loginhandle = async () => {
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?!.*[<>&'"])[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.{8,30}$)(?=.*[a-zA-Z])(?=.*\d)(?!.*[^ -~])(?!.*[<>&'"]).*$/;
    console.log("開始輸入");

    if (emailRegex.test(email) && passwordRegex.test(password)) {
      try {
        const res = await signIn("login", {
          redirect: false,
          email,
          password,
        });

        if (res && res.error) {
          setmessage("伺服器登入失敗");
        } else {
          router.replace("/quote");
        }
      } catch (e) {
        setmessage("伺服器登入失敗");
      }
    } else {
      console.log("wfwe");
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
    }
  };

  return (
    <div className="flex flex-col  sm:w-[80%] mx-auto  bg-yellow-50">
      {message && <div className="mx-auto bg-slate-200 mt-5">{message}</div>}
      <form
        onSubmit={loginhandle}
        className="flex flex-col w-[60%] mx-auto  bg-gray-300 border-black border-2 rounded-lg px-4 m-4"
      >
        <label htmlFor="email" className="p-1  mt-3 ">
          信箱:
        </label>
        <input
          type="email"
          id="email-input"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          className={`pt-1 rounded-md border-2  shadow  ${emailAnimation ? " border-red-600 border-2 animate-shake" : ""}`}
          onAnimationEnd={() => setemailAnimation(false)}
          autoComplete="email"
        />
        {emailError && (
          <div className=" mx-auto text-red-500">{emailError}</div>
        )}
        <label htmlFor="password" className="pt-1 rounded-md mt-1 ">
          密碼:
        </label>
        <input
          type="password"
          value={password}
          id="password-imput"
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          className={`pt-1 rounded-md mt-1 shadow border-black border-2 ${passwordAnimation ? " border-red-600 border-2 animate-shake" : ""}`}
          onAnimationEnd={() => setpasswordAnimation(false)}
          autoComplete="current-password"
        />
        {passwordError && (
          <div className=" mx-auto text-red-500">{passwordError}</div>
        )}
        <div className="flex justify-center">
          <button
            type="button"
            className="bg-blue-500 rounded-lg  p-1 m-3  w-20 text-center  shadow"
            onClick={() => {
              loginhandle();
            }}
          >
            登入
          </button>
          <a
            href="/register"
            className="bg-blue-500 rounded-lg  p-1 m-3  w-20 text-center shadow"
          >
            註冊
          </a>
        </div>
        <div className="flex justify-center items-center"></div>
        <div className="w-[0%] mx-auto  ">
          <button
            onClick={() => signIn("google")}
            className="rounded-full bg-red-700 p-0 w-full transition-transform duration-100 ease-in-out transform active:scale-98 active:shadow-lg"
          >
            <picture>
              <source
                srcSet="/photos/google/signin-assets/Web/png@2x/light/web_light_rd_SI@2x.png"
                media="(min-width: 640px)"
              />
              <source
                srcSet="/photos/google/signin-assets/Web/png@3x/light/web_light_rd_SI@3x.png"
                media="(min-width: 768px)"
              />
              <source
                srcSet="/photos/google/signin-assets/Web/png@4x/light/web_light_rd_SI@4x.png"
                media="(min-width: 1024px)"
              />

              <img
                src="/photos/google/signin-assets/Web/png@1x/light/web_light_rd_SI@1x.png"
                alt="google登入"
                style={{ width: "100%", height: "auto" }}
              />
            </picture>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComponentName;
