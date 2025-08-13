interface imageUpload {
  pictureName: string;
  file: File;
  fileUUID: string;
  photoNumber: string;
}

self.onmessage = async function (event) {
  const { pictureName, file, fileUUID, photoNumber }: imageUpload = event.data;
  const maxParallelUpload = 2;
  const chunkSize = 1024 * 1024; //1bytes = 1024 kb  1024kb=1MB
  const totalChunks = Math.ceil(file.size / chunkSize);

  //* 分片

  const chunkQue = []; //併發列隊陣列
  for (let index = 0; index < totalChunks; index++) {
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    const props: chunkUploadWithRetry = {
      SliceIndex: index,
      chunk,
      totalChunks,
      fileUUID,
    };
    chunkQue.push(() => {
      return chunkUploadWithRetry(props);
    });
  }

  //上傳
  interface chunkUploadWithRetry {
    SliceIndex: number;
    chunk: Blob;
    totalChunks: number;
    fileUUID: string;
    retries?: number;
  }
  interface uploadReturn {
    success: boolean;
    SliceIndex: number;
  }
  const chunkUploadWithRetry = async ({
    SliceIndex,
    chunk,
    totalChunks,
    fileUUID,
    retries = 3,
  }: chunkUploadWithRetry) => {
    while (retries > 0) {
      try {
        const formdata = new FormData();
        formdata.append("fileUUID", fileUUID);
        formdata.append("pictureName", pictureName);
        formdata.append("SliceIndex", SliceIndex.toString());
        formdata.append("chunk", chunk);
        formdata.append("totalChunks", totalChunks.toString());
        formdata.append("photoNumber", photoNumber.toString());
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_WEBSIDE_URL}/api/upload`,
          {
            method: "POST",
            credentials: "include",
            body: formdata,
          }
        );

        if (!response.ok) {
          return { success: false, SliceIndex };
        }

        return { success: true, SliceIndex };
      } catch (e) {
        retries--;
        console.log(
          `分片,${fileUUID},第${SliceIndex}個,第${retries}次,上傳失敗`
        );
        if (retries == 0) {
          //+ 分片上傳失敗
          return { success: false, SliceIndex };
        }
      }
    }
    return { success: false, SliceIndex };
  };

  //併發控制
  interface concurrently {
    chunkQue: (() => Promise<uploadReturn>)[];
    maxParallelUpload: number;
  }

  //* 併發上傳，function異步代碼，不加trycatch
  const concurrently = async ({
    chunkQue,
    maxParallelUpload,
  }: concurrently) => {
    const executing: Promise<void>[] = [];
    const results: uploadReturn[] = [];
    let i = 0;
    for (const task of chunkQue) {
      const taskPromise = task()
        .then((result) => {
          i++;
          results.push(result);
          self.postMessage({
            success: "uploading",
            progress: Math.floor(i / totalChunks) * 100,
          });
        })
        .catch((error) => {
          self.postMessage({
            success: "failure",
            progress: "",
          });
          return console.log(error);
        })
        .finally(() => {
          executing.splice(executing.indexOf(taskPromise), 1);
        });
      executing.push(taskPromise);
      if (executing.length >= maxParallelUpload) {
        await Promise.race(executing);
      }
    }

    await Promise.all(executing);
    return results;
  };

  //* 併發結果確認
  try {
    const input: concurrently = { chunkQue, maxParallelUpload };

    const result = await concurrently(input);
    const allSuccess = result.every((result) => {
      result.success == true;
    });

    if (allSuccess) {
      self.postMessage({
        success: "success",
        progress: "",
      });
    } else {
      self.postMessage({
        success: "failure",
        progress: "",
      });
    }
  } catch (e) {
    const errorMessage = e instanceof ErrorEvent ? e.message : String(e);
    self.postMessage({
      success: "failure",
      progress: "",
      message: errorMessage,
    });
  }
};

self.onerror = (e: Event | string) => {
  const errorMessage = e instanceof ErrorEvent ? e.message : String(e);
  self.postMessage({ type: "uncaught-error", error: errorMessage });
  return true;
};
