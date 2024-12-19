import React from "react";
import RichTextEditor from "@/components/RichTextEditor";
import Text from "@/components/test";
import ImageUpload from "@/components/imageUpload";

const page = () => {
  return (
    <div>
      <h1>簡易富文本編輯器</h1>
      {/* <RichTextEditor /> */}
      {/* <Text /> */}
      <ImageUpload />
    </div>
  );
};

export default page;
