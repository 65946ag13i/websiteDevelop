"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { deepCloneArray } from "@/untils/deepcloneArray";
const imageUpload: React.FC = () => {
  const [photoFile, setphotoFile] = useState<(File | null)[][]>([[null, null]]);
  const deleteFileButton = (index: number) => {
    setphotoFile((prev) => {
      return prev.filter((_, number) => {
        number !== index;
      });
    });
  };

  const addFile = () => {
    setphotoFile((prev) => {
      return [...prev, [null, null]];
    });
  };

  const [phtotURL, setPhtotURL] = useState<(string[] | null)[][]>([
    [null, null],
  ]);

  const createURLAndSaveFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    option: number
  ) => {
    if (!e || !e.target) return;

    //URLCreate
    const fileArray = e.target.files;
    if (!fileArray) return;
    Array.from(fileArray).map((file) => {
      const photofile = new FileReader();

      photofile.onerror = function (error) {
        if (error) return;
      };

      photofile.onload = function (event) {
        const result = event.target?.result as string | null;
        if (!result) return;
        setPhtotURL((prev) => {
          const newURL = deepCloneArray(prev);
          if (Array.isArray(newURL[index][option])) {
            newURL[index][option] = [...newURL[index][option], result];
            return newURL;
          } else {
            newURL[index][option] = [];
            newURL[index][option] = [...newURL[index][option], result];
            return newURL;
          }
        });
      };
      //[[null, null], [string[], string[]]]
      photofile.readAsDataURL(file);
    });
  };

  return (
    <>
      <div>
        {" "}
        {photoFile &&
          photoFile.map((group, index) => (
            <div key={"group" + index}>
              <div>第{index}組內外機照片</div>
              <div>內機</div>
              {phtotURL[index][1] &&
                phtotURL[index][1].map((photo, index2) => (
                  <Image
                    src={photo}
                    key={index2 + "-photo-" + index + "-file"}
                    layout="responsive"
                    alt="上傳圖片預覽"
                    width={150}
                    height={100}
                  />
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

              <label htmlFor={"group" + index + "-file-" + "2"}>
                添加外機照片
              </label>
              <input
                type="file"
                multiple
                style={{ display: "none" }}
                id={"group" + index + "-file-" + "2"}
              ></input>
              <div>
                {" "}
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
            </div>
          ))}
      </div>
    </>
  );
};

export default imageUpload;
