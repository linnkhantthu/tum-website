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
      className={`flex flex-col alert max-w-[21rem] min-w-[21rem] items-center ${flashMessage.category}`}
    >
      <span className="flex flex-row items-center w-full">
        {/* Icon */}
        <span className="min-w-[20px] mr-3 text-lg ">
          <FaInfoCircle />
        </span>
        {/* Info */}
        <span className="line-clamp-2 text-left text-wrap text-base min-w-[250px]">
          {flashMessage.message}
        </span>
        {/* Action */}
        <span
          onClick={() => {
            onDelete(flashMessage.id);
          }}
          className="bg-base-100 mb-10 btn btn-circle btn-xs btn-outline btn-error"
        >
          <FaXmark />
        </span>
      </span>
    </div>
  );
}

export default Toast;
