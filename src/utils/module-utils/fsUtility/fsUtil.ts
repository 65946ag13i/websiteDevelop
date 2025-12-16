import fs from 'fs/promises';
import path from 'path';

//* 查找目錄或創建
export async function checkOrCreateFolder(
  dirPath: string,
  create: boolean = false
) {
  try {
    await fs.access(dirPath);
    return true; // 目錄已存在
  } catch (error) {
    console.error('目錄查找:', error);
    if (create) {
      await fs.mkdir(dirPath, { recursive: true });
      return true; // 目錄不存在，已建立
    }
    return false; // 目錄不存在且未要求建立
  }
}

//*消毒../ 及./  避免路徑攻擊
export function sanitizeInput(input: string): string {
  // 移除所有路徑遍歷模式
  return input
    .replace(/\.\.(\/|\\)/g, '') // 移除 ../
    .replace(/\.(\/|\\)/g, ''); // 移除 ./
}

//* 讀取目錄所有圖片,返回所有圖片"名稱"陣列 (圖片名稱)
export async function readDirectoryImages(dirPath: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dirPath);
    const images = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
    return images;
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

//* 獲取檔案上傳副檔名
export async function getContentTypeByExtension(
  filePath: string
): Promise<string | false> {
  const ext = path.extname(filePath).toLowerCase();

  const extensionMap: Record<string, string> = {
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
  };

  return Object.hasOwn(extensionMap, ext) ? extensionMap[ext] : false;
}
