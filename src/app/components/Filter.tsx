import { Article } from "@/lib/models";
import React, { useState } from "react";
import { FaCheck, FaFilter } from "react-icons/fa";

function Filter({
  isPublished,
  setIsPublished,
  setSkip,
  setCurrentPageNo,
}: {
  isPublished: boolean;
  setIsPublished: React.Dispatch<React.SetStateAction<boolean>>;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPageNo: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="flex flex-row justify-end items-center">
      <div>
        <div className="dropdown sm:dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm m-1">
            <FaFilter />
          </div>
          <ul
            tabIndex={0}
            className={
              "dropdown-content menu bg-base-200 rounded-box z-[1] w-52 p-2 shadow"
            }
          >
            <li className={isPublished ? "" : "bg-base-100"}>
              <a
                onClick={() => {
                  const element = document.activeElement;
                  if (element) {
                    // @ts-ignore
                    element?.blur();
                  }
                  setSkip(-10);
                  setCurrentPageNo(0);
                  setIsPublished(!isPublished);
                }}
              >
                Drafts
                {isPublished ? "" : <FaCheck className="text-right" />}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Filter;
