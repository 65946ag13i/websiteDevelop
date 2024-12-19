"use client";

import React, { useState } from "react";

const DynamicPhotoInputs = () => {
  // 使用数组管理多个输入的状态
  const [photos, setPhotos] = useState<(File | null)[]>([]);

  // 添加新的输入框
  const addInput = () => {
    setPhotos([...photos, null]); // 初始化为 null 表示还未选择文件
  };

  // 处理文件选择
  const handleFileChange = (index: number, file: File) => {
    const newPhotos = [...photos];
    newPhotos[index] = file; // 更新对应索引的文件
    setPhotos(newPhotos);
  };

  // 提交上传
  const handleUpload = () => {
    console.log("上传的照片:", photos);
    // 可以通过 FormData 将文件上传到后端
    const formData = new FormData();
    photos.forEach((file, index) => {
      if (file) {
        formData.append(`photo${index + 1}`, file);
      }
    });
    // 模拟上传
    console.log("FormData 内容:", formData);
    // 这里可以用 fetch/axios 将 formData 发送到服务器
  };

  return (
    <div>
      <h1>动态添加照片输入</h1>
      <button onClick={addInput}>添加照片输入框</button>
      {photos.map((_, index) => (
        <div key={index}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileChange(index, e.target.files[0]);
              }
            }}
          />
        </div>
      ))}
      <button onClick={handleUpload}>上传所有照片</button>
    </div>
  );
};

export default DynamicPhotoInputs;
