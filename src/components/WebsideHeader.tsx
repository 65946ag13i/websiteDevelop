import React from "react";
import Link from "next/link";
const WebsideHeader: React.FC = () => {
  return (
    <nav>
      <div className="flex items-center justify-center text-3xl  p-6 bg-gray-100 ">
        <Link href="/" className="text-3xl">
          建豐電器有限公司
        </Link>
      </div>
    </nav>
  );
};

export default WebsideHeader;
