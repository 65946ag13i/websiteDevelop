"use client";
import axios from "axios";
import React, { useState } from "react";
import cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const severURL = "http://localhost:3000";
const ComponentName: React.FC = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [message, setmessage] = useState("");
  const router = useRouter();
  const loginhandle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("開始輸入");
    const res = await signIn("login", {
      redirect: false,
      email,
      password,
    });
    // console.log("登入資訊-----------------------");
    // console.log(res);
    // console.dir(res, { depth: null });

    if (res && res.error) {
      console.log("錯誤訊息啟動");
      setmessage(res.error);
      console.log(res.error);
    } else {
      router.replace("/quote");
    }

    // try {
    //   const response = await axios.post(severURL + "/api/auth/signin", {
    //     email,
    //     password,
    //   });
    //   const { token } = response.data;
    //   if (token) {
    //     const in3min = new Date(new Date().getTime() + 180 * 1000); //取得當前毫秒數
    //     cookies.set("token", token, { expires: in3min });

    //     router.push("/");
    //   }
    // } catch (e) {
    //   if (e instanceof Error) {
    //     setmessage(e.message);
    //   } else {
    //     setmessage("登入時發生錯誤!");
    //   }
    // }
  };

  return (
    <div className="flex  w-[70%] mx-auto">
      {message && <div className="mx-auto bg-slate-200 mt-5">{message}</div>}
      <form onSubmit={loginhandle} className="flex flex-col w-[30%] mx-auto ">
        <label htmlFor="email" className="p-1  mt-3 ">
          信箱地址:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          required
          className="pt-1 rounded-md"
        />
        <label htmlFor="password" className="pt-1 rounded-md mt-1 ">
          密碼:
        </label>
        <input
          type="password"
          value={password}
          id="password"
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          className="pt-1 rounded-md mt-1 "
        />
        <button
          type="submit"
          className="bg-blue-600 rounded-lg  p-1 mt-5 mb-5  w-20 mx-auto  "
        >
          登入
        </button>
      </form>
    </div>
  );
};

export default ComponentName;
