import React from "react";
import { useState } from "react";
import Image from "next/image";

const ComponentName: React.FC = () => {
  const [filePhoto, setFilePhoto] = useState<{ file: File; name: string }[]>(
    []
  ); //後端照片上傳控制
  // const [PhotoURL, setPhotoURL] = useState<string[]>([]); //前端照片存儲控制
  const fileHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    // console.log("照片上傳陣列" + JSON.stringify(files, null, 3));
    // console.dir(files, { depth: null });
    if (files && filePhoto.length === 0) {
      const fileArray = Array.from(files).map((file) => {
        return { file, name: file.name };
      });
      setFilePhoto(fileArray);
    } else if (files && filePhoto.length > 0) {
      const fileArray = Array.from(files).map((file) => {
        return { file, name: file.name };
      });
      setFilePhoto([...filePhoto, ...fileArray]);
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
    setFilePhoto(filePhoto.filter((_, number) => number !== index));
  };

  return (
    <div>
      <div className="w-[50%] mx-auto">
        {filePhoto && filePhoto.length > 0 && (
          <>
            <div>目前照片數量:{filePhoto.length}</div>
            {filePhoto.map((item, index) => (
              <div key={index}>
                <Image
                  src={URL.createObjectURL(item.file)}
                  key={index + 1}
                  layout="responsive"
                  alt="上傳圖片預覽"
                  width={150}
                  height={100}
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
    </div>
  );
};

export default ComponentName;
