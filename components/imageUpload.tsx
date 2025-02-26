"use client";

import { useState } from "react";
import Image from "next/image";
import { deepCloneArray } from "@/untils/deepcloneArray";

async function AddPhoto(fileArray: FileList) {
  const newURL = Array.from(fileArray).map((file) => {
    return new Promise((resolve, reject) => {
      const fileName = file.name;
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
        const photofile = new FileReader();

        photofile.onerror = function (error) {
          if (error) reject();
        };

        photofile.onload = function (event) {
          const result = event.target?.result as string | null;
          if (!result) reject(new Error("FileReader returned null"));

          //-----image---
          const img = new window.Image();
          img.onload = async () => {
            if (!result) return reject(new Error("FileReader result is null"));
            const canvus = document.createElement("canvas");
            const ctx = canvus.getContext("2d");
            if (ctx) {
              canvus.width = img.width;
              canvus.height = img.height;
              ctx.drawImage(img, 0, 0);

              const url = canvus.toDataURL("image/jpeg", 0.8);
              try {
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
          img.src = result!;
          //-----image---
        };
        //[[null, null], [string[], string[]]]
        photofile.readAsDataURL(file);
      }
    });
  });

  const photoURL = await Promise.all(newURL);
  return photoURL as { url: string; file: File }[];
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
  const createURLAndSaveFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    option: number
  ) => {
    if (!e || !e.target || !e.target.files) return;

    //URLCreate
    const photoUrlAndFile = await AddPhoto(e.target.files);
    const photoUrl: string[] = photoUrlAndFile.map((data) => data.url);
    const photoFile: File[] = photoUrlAndFile.map((data) => data.file);

    if (photoUrl.length === 0 || photoFile.length === 0) return;

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
  };
  //刪除照片
  const deleteURLAndFile = (
    index: number,
    option: number,
    photoindex: number
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
            <div key={"group" + index}>
              <div>第{index + 1}組內外機照片</div>
              <div>內機</div>
              {photoURL[index][1] &&
                photoURL[index][1].map((photo, index2) => (
                  <>
                    <Image
                      src={photo}
                      key={index2 + "-photo-" + index + "-file"}
                      layout="responsive"
                      alt="上傳圖片預覽"
                      width={150}
                      height={100}
                    />
                    <button
                      onClick={() => {
                        deleteURLAndFile(index, 1, index2);
                      }}
                    >
                      刪除
                    </button>
                  </>
                ))}
              <label htmlFor={"group" + index + "-file-" + "1"}>
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

              <div>外機</div>
              {photoURL[index][2] &&
                photoURL[index][2].map((photo, index2) => (
                  <>
                    <Image
                      src={photo}
                      key={index2 + "-photo-" + index + "-file"}
                      layout="responsive"
                      alt="上傳圖片預覽"
                      width={150}
                      height={100}
                    />
                    <button
                      onClick={() => {
                        deleteURLAndFile(index, 2, index2);
                      }}
                    >
                      刪除
                    </button>
                  </>
                ))}
              <label htmlFor={"group" + index + "-file-" + "2"}>
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
              {index !== 0 && (
                <div>
                  <label>
                    <button
                      id={"deleteFile" + index}
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
