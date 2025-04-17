export async function getFileArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result;
        if (arrayBuffer instanceof ArrayBuffer) {
          resolve(arrayBuffer);
        }
      };
      fileReader.onerror = () => {
        reject(null);
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      reject(null);
    }
  });
}
