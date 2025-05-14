"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const ImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [photoIndex, setphotoIndex] = useState<number>(1);
  const [transformControl, settransformControl] = useState<boolean>(true);
  const photoLeftHandle = () => {
    setphotoIndex((newState) => newState - 1);
    settransformControl(true);
  };
  const photoRightHandle = () => {
    setphotoIndex((newState) => newState + 1);
    settransformControl(true);
  };
  useEffect(() => {
    if (photoIndex === 0) {
      setTimeout(() => {
        settransformControl(false);
        setphotoIndex(images.length);
      }, 300);
    }
    if (photoIndex === images.length + 1) {
      setTimeout(() => {
        settransformControl(false);
        setphotoIndex(1);
      }, 300);
    }
  }, [photoIndex]);

  return (
    <div className=" mx-auto w-[70%]  min-h-screen bg-white  ">
      <div className="relative mx-auto w-[40%] bg-white overflow-hidden">
        <div
          className={`flex  transition-transform ${transformControl ? "duration-300" : " duration-0"}`}
          style={{ transform: `translateX(-${photoIndex * 100}%)` }}
        >
          {images && (
            <Image
              src={images[images.length - 1]}
              key={`last-image`}
              alt="冷氣髒污圖片"
              width={1774}
              height={2364}
              className="object-contain"
            />
          )}
          {images &&
            images.map((item, index) => (
              <Image
                src={item}
                key={index}
                alt="冷氣髒污圖片"
                width={1774}
                height={2364}
                className="object-contain"
              />
            ))}
          {images && (
            <Image
              src={images[0]}
              key={`first-imgage`}
              alt="冷氣髒污圖片"
              width={1774}
              height={2364}
              className="object-contain"
            />
          )}
        </div>
        <button
          onClick={photoLeftHandle}
          className=" absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-70 rounded-md text-white"
        >
          &lt;
        </button>
        <button
          onClick={photoRightHandle}
          className=" absolute top-1/2 right-2 transform -translate-y-1/2  bg-black bg-opacity-70 rounded-md text-white"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
