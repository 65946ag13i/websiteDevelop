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
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
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
      console.log("--app api quoteUpload uploadImage 啟動分片儲存--");
      const userID = session?.user.id;
      //* 轉換成寫入需求格式
      const arrayBuffer = await chunk.arrayBuffer();
      const bufferData = Buffer.from(arrayBuffer);
      //create merge slice directory
      const fileNameParse = path.parse(pictureName);
      //~ 建立檔名fileName資料夾儲存分片 fileName-`${index}-${secondIndex}-${fileindex}`
      //* 建立檔案專屬分片資料夾
      const fileDirName = photoNumber + "-" + fileNameParse.name;
      //* userDir -> uuidDir -> fileDir
      //* 圖片專屬分片資料夾
      const fileDirPath = path.join(
        process.cwd(),
        "src",
        "Data",
        "User",
        userID,
        fileUUID,
        fileDirName,
      );
      console.log("fileDirPath路徑:" + fileDirPath);
      //~ 創建分片資料夾
      async function checkDirectory(dirPath: string) {
        try {
          await fs.access(dirPath); //查找是否有該位置
          console.log("已有目錄");
        } catch (error) {
          console.error("uploadImageError:", error);
          await fs.mkdir(dirPath, { recursive: true });
          console.log(`資料夾不存在，已建立：${dirPath}`);
        }
      }

      await checkDirectory(fileDirPath);
      //~ 創建分片資料夾

      //~ 建立分片檔案名
      //* create slice file name
      //* fileDir -> fileSilce
      const fileSliceName = path.join(
        fileDirPath,
        `${fileNameParse.name}-SliceIndex_${SliceIndex}-totalChunks_${totalChunks}-photoNumber_${photoNumber}`,
      );
      //+ 分片檔案名路徑後儲存
      console.log("fileSliceName路徑:" + fileDirPath);
      await fs.writeFile(fileSliceName, bufferData);
      //~ 建立分片檔案名

      //~ 檢查分片資料夾數量 返回該fileName Dirctory內所有檔名
      const filesNameArray = await fs.readdir(fileDirPath);
      //* 確認檔案是不是檔案 返回檔案名  及 ( 是否為檔案 值為bollean )
      const fileStats = await Promise.all(
        filesNameArray.map(async (file) => {
          const filePath = path.join(fileDirPath, file);
          //* stat確認是否為檔案
          const stats = await fs.stat(filePath);
          return { name: file, isFile: stats.isFile() };
        }),
      );
      console.log("filesNameArray.length:", filesNameArray);

      //* 確認是否為檔案 返回名稱陣列
      const isSliceData = fileStats
        .filter((fileChck) => {
          return fileChck.isFile == true;
        })
        .map((f) => f.name);
      console.log("isSliceData.length:", isSliceData);

      //* 過濾空值 讀取fileName 及 分片號碼
      const fileNameAndIndex = isSliceData
        .map((fileName) => {
          const regex =
            /^(.*?)-SliceIndex_(\d+)-totalChunks_(\d+)-photoNumber_(\d+)/;
          const match = fileName.match(regex);
          if (!match) return null;
          return {
            name: fileName,
            SliceIndex: parseInt(match[2], 10),
          };
        })
        .filter((fileList) => fileList != null);

      //* 資料夾數量==總分片量就合併
      console.log("啟動所有分片合併後儲存之前的數字檢查--");
      console.log(fileNameAndIndex.length);
      console.log(Number(totalChunks));
      console.log(fileNameAndIndex.length == Number(totalChunks));

      if (fileNameAndIndex.length == Number(totalChunks)) {
        //* 整理順序準備合併 sort and prepare for merging
        console.log("--app api quoteUpload uploadImage 啟動分片合併並儲存--");
        const sortFiles = fileNameAndIndex
          .sort((a, b) => a.SliceIndex - b.SliceIndex)
          .map((file) => {
            return file.name;
          });

        console.log(`資料夾中共有 ${fileNameAndIndex.length} 個檔案`);
        console.dir(fileNameAndIndex, { depth: null });

        //* 建立檔案名稱 在前端的嵌套結構位置+檔名 `${index}-${secondIndex}-${fileindex}`-fileName.jpg
        const fileName = photoNumber + "-" + fileNameParse.base;
        //* userID -> uuidDir -> file.jpg
        //* 在UUID資料夾建立檔案名
        const filePath = path.join(
          process.cwd(),
          "src",
          "Data",
          "User",
          userID,
          fileUUID,
          fileName,
        );

        const writeStream = createWriteStream(filePath);
        try {
          for (const name of sortFiles) {
            const slicePath = path.join(fileDirPath, name);
            const readStream = createReadStream(slicePath);
            // await pipeline(readStream, writeStream);
            await new Promise((resolve, reject) => {
              readStream.on("error", reject);
              readStream.pipe(writeStream, { end: false });
              readStream.on("end", () => {
                readStream.close();
                resolve(null);
              });
            });
          }
          // 正確關閉 writeStream

          writeStream.end();
          await new Promise<void>((resolve) => {
            writeStream.on("close", resolve);
          });

          // 延迟一段时间确保所有文件句柄释放（Windows需要）
          await new Promise((resolve) => setTimeout(resolve, 100));

          // writeStream.end();
          // await finished(writeStream);
          //* 刪除分片資料夾
          //* userDir -> uuidDir -> fileDir
          // console.log("準備刪除分片資料夾:", fileDirPath);
          // await fs.rm(fileDirPath, { recursive: true, force: true });
          // console.log("已刪除!!:", fileDirPath);
          // 尝试删除分片文件夹
          let retryCount = 0;
          const maxRetries = 5;

          while (retryCount < maxRetries) {
            try {
              console.log(
                `尝试删除分片文件夹 (尝试 ${retryCount + 1}/${maxRetries}):`,
                fileDirPath,
              );
              await fs.rm(fileDirPath, { recursive: true, force: true });
              console.log("已成功删除:", fileDirPath);
              break;
            } catch (deleteError) {
              retryCount++;
              if (retryCount >= maxRetries) {
                console.error(
                  "删除文件夹失败，已达到最大重试次数:",
                  deleteError,
                );
                // 可以选择记录错误但不中断流程
                break;
              }
              // 等待一段时间后重试
              await new Promise((resolve) =>
                setTimeout(resolve, 200 * retryCount),
              );
            }
          }
        } catch (error) {
          console.error("readWriteStreamError", error);
          writeStream.destroy();
        }

        return NextResponse.json({ message: "ok" }, { status: 200 });
      } else {
        console.log("Cannot merge files at this time");
        console.log(
          `currentSliceIndex:${SliceIndex},totalChunks:${totalChunks}`,
        );
        return NextResponse.json(
          {
            message:
              "The files cannot be mergeed because the required number has not been reached",
          },
          { status: 200 },
        );
      }
    } else {
      console.error("資料驗證錯誤");
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "sever error" }, { status: 500 });
  }
}
//  /^(\d+)-(\d+)-([a-zA-Z0-9_\-]+)\.([a-zA-Z0-9]+)$/;
