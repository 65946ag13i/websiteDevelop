import React from "react";

// 定義 variant 和 size 的合法值
type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg";

// 定義 props 型別
interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const ButtonModule: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  className = "",
  type = "button",
}) => {
  // 基礎樣式（通用）
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-colors
    ${fullWidth ? "w-full" : ""}
    ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
  `;

  // 不同 variant 的樣式
  const variantStyles: Record<Variant, string> = {
    primary: "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white",
    secondary:
      "bg-gray-200 hover:bg-gray-300 focus:ring-gray-500 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white",
    ghost: "bg-transparent hover:bg-gray-200 focus:ring-gray-500 text-gray-700",
  };

  // 不同 size 的樣式
  const sizeStyles: Record<Size, string> = {
    sm: "text-sm px-3 py-1.5 rounded-md",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3 rounded-xl",
  };

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <svg
            className={`animate-spin -ml-1 mr-2 h-4 w-4 ${size === "sm" ? "h-3 w-3 mr-1" : size === "lg" ? "h-5 w-5 mr-3" : "h-4 w-4 mr-2"}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          載入中...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonModule;
