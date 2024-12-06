"use client";
import dotenv from "dotenv";
dotenv.config();
import React, { useState, useEffect } from "react";
import axios from "axios";
//
const register: React.FC = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  //emaill 驗證
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let emailError = "";
      function checkError(errorMessage: string, message: string): string {
        return errorMessage ? `${errorMessage}, ${message}` : message;
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
        return errorMessage ? `${errorMessage}, ${message}` : message;
      }

      if (password.length > 30 || password.length < 8) {
        passwordError = checkError(
          passwordError,
          "密碼長度應該 8 到 30 字元之間"
        );
      }
      const containLetter = /^(?=.*[a-zA-Z])$/;
      if (!containLetter.test(email)) {
        passwordError = checkError(passwordError, "應該包含一個大寫或小寫");
      }

      const passwordNumber = /^(?=.*\d)$/;
      if (!passwordNumber.test(email)) {
        passwordError = checkError(passwordError, "應該包含一個大寫或小寫");
      }

      const illegalCharRegex = /^[\x21-\x7E]+$/;
      if (illegalCharRegex.test(email)) {
        passwordError = checkError(passwordError, "Email 包含非法字元");
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
  }, [email]);

  const registerOnload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axios.post(process.env.NEXTAUTH_URL + "/api/register", {
      email,
      password,
    });
  };

  return (
    <div className="flex items-center  mx-auto w-[80%]">
      <div className="mx-auto bg-slate-400">
        <form onSubmit={registerOnload} className="flex flex-col">
          {emailError && <div>{emailError}</div>}
          <label htmlFor="email">
            信箱:
            <input
              type="text"
              id={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
          </label>
          <label htmlFor="password">
            密碼:
            <input
              type="text"
              id={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
          </label>
          <button type="submit">送出</button>
        </form>
      </div>
    </div>
  );
};

export default register;
