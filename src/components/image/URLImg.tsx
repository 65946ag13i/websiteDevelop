import { useState, useEffect, ImgHTMLAttributes } from "react";
import Image, { ImageProps } from "next/image";

interface ServerImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  src: string;
  alt: string;
  onError?: (error: Event | string) => void;
  onLoad?: () => void;
  fallbackText?: string;
  retryCount?: number;
  retryDelay?: number;
  className?: string;
}

const URLImage: React.FC<ServerImageProps> = ({
  src,
  alt,
  onError,
  onLoad,
  fallbackText = "圖片載入失敗",
  retryCount = 2,
  retryDelay = 1000,
  className,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryAttempts, setRetryAttempts] = useState<number>(0);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryAttempts(0);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image loading error:", e);

    if (retryAttempts < retryCount) {
      // 重试机制
      setTimeout(() => {
        setRetryAttempts((prev) => prev + 1);
        // 通过添加时间戳参数来避免缓存
        setImgSrc(`${src}?retry=${Date.now()}`);
        setIsLoading(true);
        setHasError(false);
      }, retryDelay);
    } else {
      // 所有重试尝试都失败
      setIsLoading(false);
      setHasError(true);
      if (onError) onError(e.nativeEvent);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const retryLoadImage = () => {
    setRetryAttempts(0);
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  };

  // 如果图片加载失败，显示文字错误
  if (hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gray-100 text-gray-400 border border-dashed border-gray-300 rounded-lg ${className || ""}`}
        style={{
          width: props.width || "100%",
          height: props.height || "100%",
        }}
      >
        <svg
          className="w-12 h-12 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-sm mb-2 text-center px-2">{fallbackText}</p>
        <button
          onClick={retryLoadImage}
          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          重新加載
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-block overflow-hidden ${className || ""}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        crossOrigin="use-credentials"
        {...props}
      />
    </div>
  );
};

export default URLImage;
