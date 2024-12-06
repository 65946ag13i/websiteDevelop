"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";

const RichTextEditor: React.FC = () => {
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLElement | null>(null);

  const modules = {
    toolbar: {
      container: [
        [
          { size: ["small", false, "large", "huge"] },
          { list: "ordered" },
          { list: "bullet" },
          "bold",
          "italic",
          "link",
          { color: [] },
          { background: [] },
          { uploadButton: "" },
        ],
      ],
      // handlers: {
      //   // 空的處理函數
      //   uploadButton: () => {
      //     console.log("2");
      //   },
      // },
    },
  };

  //創造一個input 綁定qill按鈕
  //按下按鈕執行圖片控制
  useEffect(() => {
    if (fileInputRef.current) return;
    if (!quillRef.current) return;
    //造一個input file按鈕
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.setAttribute("multiple", "true");
    fileInput.style.display = "none";

    //監聽chang 控制fileHandle
    const handleFileInputChange = (e: Event) => {
      if (e.target instanceof HTMLInputElement) {
        const target = e.target as HTMLInputElement;
        fileHandle({ target } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    fileInput.addEventListener("change", handleFileInputChange);

    //取得quil自定義uploadButton,監聽click觸發input

    const quillEditor = quillRef.current.getEditor();
    const quillToolbar = quillEditor.getModule("toolbar").container;
    if (!quillToolbar) return;
    const uploadButton = quillToolbar.querySelector(".ql-uploadButton");
    if (!uploadButton) return;
    // console.log(uploadButton);

    // uploadButton.classList.add("ql-uploadButton"); // 確保這個類名與 Quill 的配置一致
    // uploadButton.type = "button";

    const handleUploadButtonClick = () => {
      fileInputRef.current?.click();
    };

    uploadButton.addEventListener("click", handleUploadButtonClick);
    //按鈕添加icon,及控制重複添加
    if (!uploadButton.querySelector("img")) {
      const uploadIcon = document.createElement("img");
      uploadIcon.setAttribute("src", "/icon/upload_file.svg");
      uploadIcon.setAttribute("alt", "googleUploadIcon");
      uploadIcon.setAttribute("width", "18");
      uploadIcon.setAttribute("height", "18");
      uploadButton.appendChild(uploadIcon);
    }
    // uploadIcon.setAttribute("fill", "#444");  // 檔案導入的文件要修改顏色很麻煩
    // uploadIcon.setAttribute("stroke", "currentColor");//使用<svg> 比較好處理

    //添加隱藏input 到toolbar的formats
    const quillformats = quillToolbar.querySelector(".ql-formats");
    // console.log(quillformats);
    quillformats.appendChild(fileInput);
    //添加input到ref紀錄
    fileInputRef.current = fileInput;

    return () => {
      fileInput.removeEventListener("change", handleFileInputChange);
      uploadButton.removeEventListener("click", handleUploadButtonClick);
      fileInputRef.current?.remove();
      fileInputRef.current = null;
    };
  }, []);

  const [filePhoto, setFilePhoto] = useState<
    { file: File; name: string; url: string }[]
  >([]); //後端照片上傳控制
  // const [PhotoURL, setPhotoURL] = useState<string[]>([]); //前端照片存儲控制
  const fileHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // console.log("照片上傳陣列" + JSON.stringify(files, null, 3));
    // console.log("filePhotoState");
    // console.dir(filePhoto, { depth: null });
    // console.log("files");
    // console.dir(files, { depth: null });
    console.log(filePhoto.length);
    if (files) {
      const fileArray = Array.from(files).map((file) => {
        const fileUrl = URL.createObjectURL(file);
        return { file, name: file.name, url: fileUrl };
      });

      setFilePhoto((filePhoto) => [...filePhoto, ...fileArray]);
    }
    // if (files) {
    //儲存照片資訊到對象
    // console.log("顯示照片陣列");
    // console.log(fileArray);
    // setFilePhoto(fileArray); //陣列存起來

    // const photoURL = fileArray.map((file) => {
    //   return URL.createObjectURL(file.file);
    // });
    // console.log("顯示URL" + photoURL);
    // setPhotoURL(photoURL);
    // }
  }; //照片預覽及存儲

  const fileDelete = (index: number) => {
    const fileToDelete = filePhoto[index];

    // 清除文件的 object URL
    URL.revokeObjectURL(fileToDelete.url);
    setFilePhoto(filePhoto.filter((_, number) => number !== index));
  };

  return (
    <>
      <div>
        <ReactQuill ref={quillRef} modules={modules} theme="snow" />
      </div>
      <div className="w-[50%] mx-auto">
        {filePhoto && filePhoto.length > 0 && (
          <>
            <div>目前照片數量:{filePhoto.length}</div>
            {filePhoto.map((item, index) => (
              <div key={index}>
                <Image
                  src={item.url}
                  key={index + 1}
                  style={{ height: "auto" }}
                  alt="上傳圖片預覽"
                  width={300}
                  height={0}
                />
                <div>圖片:{index + 1}</div>
                <div>圖片名稱:{item.file.name}</div>
                <button onClick={() => fileDelete(index)} className="bg-white">
                  刪除
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};
export default RichTextEditor;
