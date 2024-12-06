import { useRef } from "react"; //ref 可儲存渲染前資料,在渲染後

export default function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
) {
  let timeoutRef = useRef<ReturnType<typeof setTimeout>>(); //引入settimeout type 給useRef參考
  return function (...args: Parameters<T>) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
//此函數不建議在useEffect 寫 ,因為effect還要在清除一次和沒寫一樣
//該函數的timeoutref 有作用,但effect 還是需要清除
//effect 依賴組件生命週期控制副作用.如果沒清除可能會有意外行為
//1.如果useState重複刷新 , 可能會有多個debounce在運行 不會重複呼叫debounce
//2.如果組件被卸載,又掛載,debounce可能不會消失會用到舊的debounce
//3.debounce在effect 不會重複呼叫
//4.使用effect ,需要使用.cancel() 取消原來函數
