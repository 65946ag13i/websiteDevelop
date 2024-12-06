import ImageCarouselServer from "@/components/ImageCarouselServer";
import React from "react";

const Example: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <div>
      <ImageCarouselServer />
    </div>
  );
};

export default Example;
