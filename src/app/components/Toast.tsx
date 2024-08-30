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
  const [timer, setTimer] = useState(5);
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
        }, 3000);
      }
    } else {
      setTimeout(() => {
        const newCount = count + 0.5;
        setCount(newCount);
        if (newCount % 20 === 0) {
          setTimer(timer - 1);
        }
      }, 25);
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
            if (timer === 0) {
              onDelete(flashMessage.id);
            }
          }}
          className=" bg-base-100 btn btn-circle btn-xs btn-outline btn-error"
        >
          {count === 100 ? (
            <span>
              <FaXmark />
            </span>
          ) : (
            timer
          )}
        </span>
      </div>
    </div>
  );
}

export default Toast;
