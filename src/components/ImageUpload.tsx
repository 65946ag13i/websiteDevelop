"use client";

import { useState } from "react";
import Image from "next/image";
import { deepCloneArray } from "@/utils/deepcloneArray";

async function AddPhoto(fileArray: FileList) {
  //將fileList轉為類陣列
  const newURL = Array.from(fileArray).map((file) => {
    return new Promise((resolve, reject) => {
      const fileName = file.name;
      //檢查格式是否為jpeg
      if (file.type === "image/jpeg") {
        const photofile = new FileReader();

        photofile.onerror = function (error) {
          if (error) reject(new Error("jpg FileReader returned null"));
        };

        photofile.onload = function (event) {
          const result = event.target?.result as string | null;
          if (!result) reject(new Error("FileReader returned null"));

          //-----image---

          resolve({ url: result, file: file });

          //-----image---
        };
        //[[null, null], [string[], string[]]]
        photofile.readAsDataURL(file);
      } else {
        //不是的話轉換為jpeg
        const photofile = new FileReader();
        //定義執行fileReader結果
        photofile.onerror = function (error) {
          if (error) reject();
        };

        photofile.onload = function (event) {
          const result = event.target?.result as string | null;
          if (!result) reject(new Error("FileReader returned null"));

          //-----image---
          //建立image執行結果
          const img = new window.Image();
          img.onload = async () => {
            if (!result) return reject(new Error("FileReader result is null"));
            //建立canvas 轉換jpeg
            const canvus = document.createElement("canvas");
            const ctx = canvus.getContext("2d");
            if (ctx) {
              canvus.width = img.width;
              canvus.height = img.height;
              ctx.drawImage(img, 0, 0);
              //canvas轉換為url並改為jpeg壓縮
              const url = canvus.toDataURL("image/jpeg", 0.8);
              try {
                //canvas轉換為blob格式存檔
                const jpgFile = await new Promise<File>((resolve, reject) => {
                  canvus.toBlob(
                    (blob) => {
                      if (blob) {
                        const file = new File([blob], fileName, {
                          type: "image/jpeg",
                        });
                        resolve(file);
                      } else {
                        reject(new Error("Failed to create blob from canvas"));
                      }
                    },
                    "image/jpeg",
                    0.8
                  );
                });

                resolve({ url: url, file: jpgFile });
              } catch (error) {
                reject(new Error("Error generating jpgFile from canvas"));
              }
            }
          };
          //執行new imag
          img.src = result!;
          //-----image---
        };
        //[[null, null], [string[], string[]]]
        //執行new FileReader
        photofile.readAsDataURL(file);
      }
    });
  });
  try {
    const photoURL = await Promise.all(newURL);
    return photoURL as { url: string; file: File }[];
  } catch (error) {
    return [];
  }

  // return photoURL as string[];
}

interface ChildProps {
  photoFile: (File[] | null)[][];
  setphotoFile: React.Dispatch<React.SetStateAction<(File[] | null)[][]>>;
  photoURL: (string[] | null)[][];
  setPhotoURL: React.Dispatch<React.SetStateAction<(string[] | null)[][]>>;
}

const ImageUpload: React.FC<ChildProps> = ({
  photoFile,
  setphotoFile,
  photoURL,
  setPhotoURL,
}) => {
  //相片上傳用File blob
  // const [photoFile, setphotoFile] = useState<(File[] | null)[][]>([
  //   [null, null],
  // ]);
  //照片顯示用file URL
  // const [phtotURL, setPhotoURL] = useState<(string[] | null)[][]>([
  //   [null, null],
  // ]);

  //刪除分組
  const deleteFileButton = (index: number) => {
    setphotoFile((prev) => {
      const prevArray = deepCloneArray(prev);
      const newAarray = prevArray.filter((_, number) => {
        return number !== index;
      });
      return newAarray;
    });

    setPhotoURL((prev) => {
      const prevArray = deepCloneArray(prev);
      const newAarray = prevArray.filter((_, number) => {
        return number !== index;
      });
      return newAarray;
    });
  };
  //增加分組
  const addFile = () => {
    setphotoFile((prev) => {
      return [...prev, [null, null]];
    });

    setPhotoURL((prev) => {
      return [...prev, [null, null]];
    });
  };

  //增加照片
  //e=使用者上傳照片,index = 第幾組內外機照片 , option=內機外機
  const createURLAndSaveFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    option: number
  ) => {
    console.log("1");
    if (!e || !e.target || !e.target.files) return;
    console.log("2");
    //URLCreate
    const photoUrlAndFile = await AddPhoto(e.target.files);
    const photoUrl: string[] = photoUrlAndFile.map((data) => data.url);
    const photoFile: File[] = photoUrlAndFile.map((data) => data.file);
    console.log("3");
    if (photoUrl.length === 0 || photoFile.length === 0) return;
    console.log("4");
    setphotoFile((prev) => {
      const newURL = deepCloneArray(prev);
      if (Array.isArray(newURL[index][option])) {
        newURL[index][option] = [...newURL[index][option], ...photoFile];
        return newURL;
      } else {
        newURL[index][option] = photoFile;
        return newURL;
      }
    });

    setPhotoURL((prev) => {
      const newURL = deepCloneArray(prev);
      if (Array.isArray(newURL[index][option])) {
        newURL[index][option] = [...newURL[index][option], ...photoUrl];
        return newURL;
      } else {
        newURL[index][option] = photoUrl;
        return newURL;
      }
    });

    e.target.value = "";
  };
  //刪除照片
  const deleteURLAndFile = (
    index: number, //第幾組內外機
    option: number, //內機或外機
    photoindex: number //第幾張圖片
  ) => {
    setPhotoURL((prev) => {
      const currentURL = deepCloneArray(prev);
      if (Array.isArray(currentURL[index][option])) {
        const newURL = currentURL[index][option].filter(
          (_, index) => index !== photoindex
        );
        currentURL[index][option] = newURL;
        return currentURL;
      } else {
        return prev;
      }
    });

    setphotoFile((prev) => {
      const currentFile = deepCloneArray(prev);
      if (Array.isArray(currentFile[index][option])) {
        const newURL = currentFile[index][option].filter(
          (_, index) => index !== photoindex
        );
        currentFile[index][option] = newURL;
        return currentFile;
      } else {
        return prev;
      }
    });
  };
  return (
    <>
      <div>
        {photoFile &&
          photoFile.map((_, index) => (
            <div
              key={"group" + index}
              className=" border-2 border-gray-950 rounded shadow m-2 p-2"
            >
              <div className="">第{index + 1}組內外機照片</div>
              <div className="text-rose-600">"每個上傳限制兩張圖片"</div>
              <div
                className="flex flex-col border-2 border-gray-950 m-2 p-2 rounded bg-webGreenToBrown-400"
                key={`index-${index}`}
              >
                <div className="border-b-2 border-gray-400">內機</div>
                {photoURL[index][1] &&
                  photoURL[index][1].map((photo, index2) => (
                    <div
                      className="w-full"
                      key={`index-${index}-out1-photo-${index2}`}
                    >
                      <Image
                        src={photo}
                        key={index2 + "-photo-" + index + "-file"}
                        alt="上傳圖片預覽"
                        width={150}
                        height={100}
                        className="w-[80%] mx-auto m-2 border-2 border-gray-900"
                      />
                      <div className="m-1 p-1">
                        <button
                          onClick={() => {
                            deleteURLAndFile(index, 1, index2);
                          }}
                          className="m-1 px-1 border-2 border-gray-900 rounded shadow"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  ))}
                <div className="m-1 p-1">
                  <label
                    htmlFor={"group" + index + "-file-" + "1"}
                    className="m-1 p-1 border-2 border-gray-900 rounded shadow"
                  >
                    添加內機照片
                  </label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id={"group" + index + "-file-" + "1"}
                    multiple
                    onChange={(file) => {
                      createURLAndSaveFile(file, index, 1);
                    }}
                  ></input>
                </div>
              </div>
              <div className="border-2 border-gray-950 m-2 p-2 rounded bg-webGreenToBrown-400">
                <div className="border-b-2 border-gray-400">外機</div>
                {photoURL[index][2] &&
                  photoURL[index][2].map((photo, index2) => (
                    <div
                      className="w-full"
                      key={`index-${index}-out-2-photo-${index2}`}
                    >
                      <Image
                        src={photo}
                        key={index2 + "-photo-" + index + "-file2"}
                        className="w-[80%] mx-auto m-2 border-2 border-gray-900"
                        alt="上傳圖片預覽"
                        width={150}
                        height={100}
                      />
                      <div className="m-1 p-1">
                        <button
                          onClick={() => {
                            deleteURLAndFile(index, 2, index2);
                          }}
                          className="m-1 px-1 border-2 border-gray-900 rounded shadow"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  ))}
                <div className="m-1 p-1">
                  <label
                    htmlFor={"group" + index + "-file-" + "2"}
                    className="p-1 m-2 border-2 border-gray-900 rounded shadow"
                  >
                    添加外機照片
                  </label>
                  <input
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    id={"group" + index + "-file-" + "2"}
                    onChange={(file) => {
                      createURLAndSaveFile(file, index, 2);
                    }}
                  ></input>
                </div>
              </div>
              {index !== 0 && (
                <div>
                  <label>
                    <button
                      id={"deleteFile" + index}
                      className="p-1 m-1 border-2 border-gray-900 rounded-lg shadow"
                      onClick={() => {
                        deleteFileButton(index);
                      }}
                    >
                      刪除本組內外機照片
                    </button>
                  </label>
                </div>
              )}
              {index !== 4 && (
                <div>
                  <label>
                    <button
                      className="px-1 m-1 border-2 border-gray-900 rounded-lg shadow"
                      id={"deleteFile" + index}
                      onClick={() => {
                        addFile();
                      }}
                    >
                      增加一組內外機照片
                    </button>
                  </label>
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default ImageUpload;
