import { FlashMessage } from "@/lib/models";
import React, { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

function Toast({
  flashMessage,
  onDelete,
}: {
  flashMessage: FlashMessage;
  onDelete: (toastId: string) => boolean;
}) {
  return (
    <div
      className={`flex flex-row rounded items-center alert ${flashMessage.category} max-w-[100%] min-w-[100%] sm:max-w-[22rem] sm:min-w-[22rem] py-1`}
    >
      <span className="flex flex-row items-center w-full">
        {/* Icon */}
        <span className="min-w-[20px] mr-3 text-lg ">
          <FaInfoCircle />
        </span>
        {/* Info */}
        <span className="sm:text-base text-sm line-clamp-2 text-left text-wrap sm:min-w-[250px]">
          {flashMessage.message}
        </span>
      </span>
      {/* Action */}
      <span
        onClick={() => {
          onDelete(flashMessage.id);
        }}
        className=" bg-base-100 btn btn-circle btn-xs btn-outline btn-error"
      >
        <span>
          <FaXmark />
        </span>
      </span>
    </div>
  );
}

export default Toast;
