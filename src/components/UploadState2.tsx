"use client";

import { AiOutlineVerticalAlignTop } from "react-icons/ai";
import { useSession } from "next-auth/react";
import UploadStateDialog from "@/components/app/quote/QuoteTable/dialog/UploadStateDialog";
const UploadState2 = () => {
  const moveToTop = () => {
    console.log("move to top");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const { status } = useSession();

  // const {
  //   fileTotalCount,
  //   fileUploadPercentage,
  //   uploadState,
  //   numberOfCurrentFiles,
  // } = useAppSelector((state) => state.uploadState);

  // const [uploadBoxOpen, setUploadBoxOpen] = useState<Boolean>(false);
  return (
    <>
      {/* 按鈕功能 */}
      <div className=" fixed right-0 bottom-0 flex flex-col mr-2 [&>*]:mb-1 w-[7%] sm:w-[6%] md:w-[4%]  lg:w-[3%]">
        <button className="" onClick={() => moveToTop()}>
          <AiOutlineVerticalAlignTop className="w-full  h-full" />
        </button>

        {"unauthenticated" === status ? null : <UploadStateDialog />}
      </div>
    </>
  );
};

export default UploadState2;
