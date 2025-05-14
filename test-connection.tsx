/* eslint-disable */
// @ts-nocheck
interface uploadFileWithWorker {
  pictureName: string;
  file: File;
  fileUUID: string;
}

function uploadFileWithWorker(
  uploadFileWithWorker: uploadFileWithWorker,
  worker: Worker
) {
  return new Promise((resolve, reject) => {
    worker.postMessage(uploadFileWithWorker);
    worker.onmessage = (event) => {
      const { success, progress } = event.data;
      switch (success) {
        case "uploading":
        //設定進度
        case "failure":
        //進度取消
        case "success":
          //總進度完成+1
          resolve({ success: true });
          console.log("123");
        default:
          reject({ success: false });
      }
      resolve({ success: true });
    };
    worker.onerror = () => {
      reject({ success: false });
    };
  });
}

//檢查錯誤後函式推入列隊
//創建UUID,worker
//導出總照片數量、上傳陣列
async function fileSequentially(fileUUID: string, worker: Worker) {
  const UUID = fileUUID;
  let photoCount = 0;
  const uploadQueue = [];

  for (const [index, firstNested] of photoFile.entries()) {
    if (index < 4) {
      //基本欄位最大3組
      for (const [secondIndex, secondNested] of firstNested.entries()) {
        if (!secondNested || secondNested.length == 0) {
          //如果沒有照片數組或為空,返回0及空數組
          return { photoCount: 0, uploadQueue: [] };
        }
        photoCount += secondNested.length;
        if (secondIndex < 2) {
          //內外機只有兩組別
          for (const [fileindex, file] of secondNested.entries()) {
            if (fileindex < 2) {
              //照片最大2張
              const props: uploadFileWithWorker = {
                pictureName: file.name,
                file,
                fileUUID: UUID,
              };
              uploadQueue.push(() => {
                uploadFileWithWorker(props, worker);
              });
            }
          }
        }
      }
    }
  }

  return { photoCount, uploadQueue };
}

//簡易認證文字表單
async function easyFormWordCheck(): Promise<boolean> {
  if (
    conditionerSelectedOption.length !== 0 &&
    bands.length <= 60 &&
    remarks.length <= 60
  ) {
    return true;
  }

  return false;
}

const dataUpload = async () => {
  const UUID = crypto.randomUUID();
  const upload = { UUID, conditionerSelectedOption, bands, remarks };

  //驗證圖片數量，返回圖片總量、待上傳異步陣列，傳入UUID
  const imageCheck = await fileSequentially(UUID);
  //簡易驗證字符串
  const formWordCheck: boolean = await easyFormWordCheck();
  //驗證表單及圖片數量後啟動上傳
  if (
    formWordCheck &&
    imageCheck.photoCount !== 0 &&
    imageCheck.uploadQueue.length !== 0
  ) {
    //後端先建立表單，失敗就不上傳圖片
    const contentUpload = await fetch(
      `${process.env.WEBSIDE_URL}/api/register/emailAuthentication`,
      {
        method: "POST",
        headers: { "content-type": "applicatiaion/json" },
        credentials: "include",
        body: JSON.stringify(upload), //upload=各種表單資訊
      }
    );
    if (contentUpload.ok) {
      //循環送出圖片
    }
  }

  //如果文字表單上傳成功 圖片上傳 啟動分片
  if (true) {
    const worker = new Worker(
      new URL("../../utils/webWorker/fileUpload.ts", import.meta.url)
    );
  }
};
interface imageUpload {
  pictureName: string;
  file: File;
  fileUUID: string;
}
