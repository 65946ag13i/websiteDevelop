import React from "react";
import fs from "fs";
import path from "path";
import ImageCarousel from "@/components/ImageCarousel";

const ImageCarouselServer = async () => {
  const directory = path.join(process.cwd(), "/public/photos/example");
  let images: string[] = [];
  //檢查是否空目錄
  if (fs.existsSync(directory)) {
    const filenames = fs.readdirSync(directory);
    images = filenames.map((name) => `/photos/example/${name}`);
  }

  return (
    <div>
      <ImageCarousel images={images} />
    </div>
  );
};

export default ImageCarouselServer;
