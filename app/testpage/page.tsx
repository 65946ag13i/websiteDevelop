// DialogExample.tsx
"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface FormData {
  name: string;
  email: string;
}

export default function DialogExample() {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
  });

  const hasUnsavedChanges = formData.name !== "" || formData.email !== "";

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("提交成功！");
    setOpen(false);
    setFormData({ name: "", email: "" });
  };

  return (
    <div className="p-8">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        {/* Trigger */}
        <Dialog.Trigger asChild>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            打開表單 Dialog
          </button>
        </Dialog.Trigger>

        <Dialog.Portal>
          {/* Overlay — 無動畫，直接顯示 */}
          <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

          {/* Content — 無動畫，直接顯示 */}
          <Dialog.Content
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700 outline-none"
            onEscapeKeyDown={(e) => {
              if (hasUnsavedChanges) {
                e.preventDefault();
                alert("還有未儲存的變更，請先儲存或取消！");
              }
            }}
            onInteractOutside={(e) => {
              if (hasUnsavedChanges) {
                alert("還有未儲存的變更，請先儲存或取消！");
              }
            }}
          >
            {/* Close Button — 使用 Heroicons X SVG */}
            <Dialog.Close asChild>
              <button
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                aria-label="關閉"
              >
                {/* Heroicons X Mark (Outline) — 直接內嵌 SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </Dialog.Close>

            {/* Title */}
            <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white">
              編輯個人資料
            </Dialog.Title>

            {/* Description */}
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              請填寫以下欄位以更新您的帳戶資訊。
            </Dialog.Description>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  姓名
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="輸入您的姓名"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  電子郵件
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="example@email.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  >
                    取消
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  儲存
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
