import { FlashMessage } from "@/lib/models";
import React, { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

function Toast({
  flashMessage,
  onDelete,
  toastId,
}: {
  flashMessage: FlashMessage;
  onDelete: (toastId: string) => boolean;
  toastId: string;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // Toast Element Class List
    const elementClassList = document.getElementById(toastId)?.classList;

    // First time out to set opacity 0

    if (count === 100) {
      const isThereFullOpacity = elementClassList?.contains("opacity-100");
      if (!isThereFullOpacity) {
        // Set Opacity after 5s
        elementClassList?.add("opacity-0");

        // Second time out for deleting toast
        setTimeout(() => {
          // Is there opacity class
          const isThereOpacity = elementClassList?.contains("opacity-0");
          if (isThereOpacity) {
            onDelete(toastId);
          }
        }, 5000);
      }
    } else {
      setTimeout(() => setCount(count + 1), 50);
    }
  }, [count]);

  return (
    <div className="flex flex-col">
      <div
        onMouseEnter={() => {
          const elementClassList = document.getElementById(toastId)?.classList;
          const isThereOpacity = elementClassList?.contains("opacity-0");
          if (isThereOpacity) {
            elementClassList?.remove("opacity-0");
          } else {
            elementClassList?.add("opacity-100");
          }
        }}
        id={toastId}
        className={`h-14 ease-in-out duration-[5000ms] flex flex-row rounded items-center alert ${flashMessage.category} max-w-[90%] min-w-[90%] sm:max-w-[22rem] sm:min-w-[22rem] py-1`}
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
      {/* <progress
        value={"50"}
        max={"100"}
        className="progress progress-info rounded-none absolute max-w-[84%] min-w-[84%] sm:max-w-[22rem] sm:min-w-[22rem] py-1"
      ></progress> */}
      <progress
        hidden={count === 100}
        className="progress progress-warning max-w-[84%] min-w-[84%] sm:max-w-[22rem] sm:min-w-[22rem] rounded-none absolute"
        value={count}
        max="100"
      ></progress>
    </div>
  );
}

export default Toast;
