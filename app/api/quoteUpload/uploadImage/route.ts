//檢驗jwt token
//解析jwt 取得使用者id
//檢查存在 建立使用者資料夾(先給我一個基本位置 我自行調整) 失敗就返回錯誤
//檢查存在 UUID 資料夾 找不到就建立一個UUID資料夾 失敗就返回錯誤
//檢查存在 photoNumber 資料夾 失敗就返回錯誤
//將分片存入
//檢查分片資料夾分片數量是否已經齊全,如果齊全直接進行組合 放入到UUID資料夾
//結束

import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/appRouter/api/auth/auth-config";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { createWriteStream, createReadStream } from "fs";

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "帳號未驗證/Unauthrized" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "sever error" }, { status: 500 });
  }

  try {
    const formdata = await req.formData();
    const fileUUID = formdata.get("fileUUID");
    const pictureName = formdata.get("pictureName");
    const SliceIndex = formdata.get("SliceIndex");
    const chunk = formdata.get("chunk") as Blob | null;
    const totalChunks = formdata.get("totalChunks");
    const photoNumber = formdata.get("photoNumber");

    if (
      typeof fileUUID == "string" &&
      typeof pictureName == "string" &&
      typeof photoNumber == "string" &&
      chunk instanceof Blob &&
      chunk &&
      fileUUID &&
      pictureName &&
      SliceIndex &&
      totalChunks &&
      photoNumber
    ) {
      console.log("--進入分片儲存與合併--");
      const userID = session?.user.id;
      //* 轉換成寫入需求格式
      const arrayBuffer = await chunk.arrayBuffer();
      const bufferData = Buffer.from(arrayBuffer);
      //create merge slice directory
      const fileNameParse = path.parse(pictureName);
      //* 建立檔名fileName資料夾 `${index}-${secondIndex}-${fileindex}`-fileName
      const fileDirName = photoNumber + "-" + fileNameParse.name;
      //* userDir -> uuidDir -> fileDir
      const fileDirPath = path.join(
        process.cwd(),
        "src",
        "Data",
        "User",
        userID,
        fileUUID,
        fileDirName
      );
      console.log("fileDirPath路徑:" + fileDirPath);
      async function checkDirectory(dirPath: string) {
        try {
          await fs.access(dirPath); //查找是否有該位置
          console.log("已有目錄");
        } catch (error) {
          await fs.mkdir(dirPath, { recursive: true });
          console.log(`資料夾不存在，已建立：${dirPath}`);
        }
      }

      checkDirectory(fileDirPath);

      //* create slice file name
      //* fileDir -> fileSilce
      const fileSliceName = path.join(
        fileDirPath,
        `%{fileName}-SliceIndex:${SliceIndex}-totalChunks:${totalChunks}-photoNumber:${photoNumber}`
      );
      console.log("fileSliceName路徑:" + fileDirPath);
      fs.writeFile(fileSliceName, bufferData);

      //* 檢查目錄數量 返回該fileName Dirctory內所有檔名
      const filesNameArray = await fs.readdir(fileDirPath);
      //* 確認檔案是不是檔案 返回檔案名  及 ( 是否為檔案 值為bollean )
      const fileStats = await Promise.all(
        filesNameArray.map(async (file) => {
          const filePath = path.join(fileDirPath, file);
          //* stat確認是否為檔案
          const stats = await fs.stat(filePath);
          return { name: file, isFile: stats.isFile() };
        })
      );

      //* 確認是否為檔案
      const isSliceData = fileStats
        .filter((fileChck) => {
          return fileChck.isFile;
        })
        .map((f) => f.name);

      //* 過濾空值 讀取fileName 及 分片號碼
      const fileNameAndIndex = isSliceData
        .map((fileName) => {
          const regex =
            /^(.*?)-SliceIndex:(\d+)-totalChunks:(\d+)-photoNumber:(\d+)/;
          const match = fileName.match(regex);
          if (!match) return null;
          return {
            name: match[1],
            SliceIndex: parseInt(match[2], 10),
          };
        })
        .filter((fileList) => fileList != null);

      //* 資料夾數量==總分片量就合併
      if (fileNameAndIndex.length == Number(totalChunks)) {
        //* 整理順序準備合併 sort and prepare for merging
        const sortFiles = fileNameAndIndex
          .sort((a, b) => a.SliceIndex - b.SliceIndex)
          .map((file) => {
            return file.name;
          });

        console.log(`資料夾中共有 ${fileNameAndIndex.length} 個檔案`);

        //* 建立檔案名稱 在前端的嵌套結構位置+檔名 `${index}-${secondIndex}-${fileindex}`-fileName.jpg
        const fileName = photoNumber + "-" + fileNameParse.base;
        //* userID -> uuidDir -> file.jpg
        const filePath = path.join(
          process.cwd(),
          "src",
          "Data",
          "User",
          userID,
          fileUUID,
          fileName
        );

        const writeStream = createWriteStream(fileDirPath);

        for (const name of sortFiles) {
          const slicePath = path.join(filePath, name);
          await new Promise<void>((resolve, reject) => {
            const readStream = createReadStream(slicePath);
            readStream.pipe(writeStream, { end: false });
            readStream.on("end", () => {
              resolve();
            });
            readStream.on("error", reject);
          });
        }

        writeStream.end();
        //* 刪了儲存資料夾的分片
        //* userDir -> uuidDir -> fileDir
        fs.rm(fileDirPath, { recursive: true, force: true });

        return NextResponse.json({ message: "ok" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ message: "sever error" }, { status: 400 });
    }
    return NextResponse.json({ message: "sever error" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "sever error" }, { status: 500 });
  }
}
//  /^(\d+)-(\d+)-([a-zA-Z0-9_\-]+)\.([a-zA-Z0-9]+)$/;
