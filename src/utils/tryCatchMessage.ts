export default async function tryCatchMessage<T>(
  callback: () => T | Promise<T>,
  currenTask: string,
): Promise<T | undefined> {
  try {
    const result = await callback();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("------產生錯誤---------");
      console.error(error);
      console.error("------產生錯誤結束------");
    } else {
      console.error("------產生錯誤---------");
      console.error(currenTask + ":產生未知Error錯誤");
      console.error("------產生錯誤結束------");
    }
    return undefined;
  }
}
