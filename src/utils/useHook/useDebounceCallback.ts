import { useCallback, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
interface debounceReturn<T extends (...args: any[]) => void> {
  // eslint-disable-next-line no-unused-vars
  (...args: Parameters<T>): void;
  cancel: () => void;
}
// eslint-disable-next-line no-unused-vars
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): debounceReturn<T> {
  void arguments;
  const callbackRef = useRef(callback);
  const setTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  callbackRef.current = callback;
  const cancel = useCallback(() => {
    if (setTimeoutRef.current) {
      clearTimeout(setTimeoutRef.current);
      setTimeoutRef.current = null;
    }
  }, []);
  // eslint-disable-next-line no-unused-vars
  const debounce = useCallback(
    (...args: Parameters<T>) => {
      void args;
      if (setTimeoutRef.current) {
        clearTimeout(setTimeoutRef.current);
      }
      setTimeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);
  (debounce as debounceReturn<T>).cancel = cancel;
  return debounce as debounceReturn<T>;
}
// eslint-disable-next-line no-unused-vars
export function useCooldownCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): debounceReturn<T> {
  const callbackRef = useRef(callback);
  const setTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCoolingRef = useRef(false);
  callbackRef.current = callback;
  const cancel = useCallback(() => {
    if (setTimeoutRef.current) {
      clearTimeout(setTimeoutRef.current);
      setTimeoutRef.current = null;
    }
  }, []);
  useEffect(() => {
    return () => {
      cancel();
    };
  }, [cancel]);

  const debounce = useCallback(
    // eslint-disable-next-line no-unused-vars
    (...args: Parameters<T>) => {
      void args;
      if (isCoolingRef.current) return;
      isCoolingRef.current = true;
      callbackRef.current(...args);
      setTimeoutRef.current = setTimeout(() => {
        isCoolingRef.current = false;
        setTimeoutRef.current = null;
      }, delay);
    },
    [delay]
  );

  (debounce as debounceReturn<T>).cancel = cancel;
  return debounce as debounceReturn<T>;
}
