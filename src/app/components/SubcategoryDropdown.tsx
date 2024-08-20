"use client";

import { Subcategory } from "@/lib/models";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { FaAngleDown } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdCheck, MdDelete } from "react-icons/md";

function SubcategoryDropdown({
  Icon,
  selectedSubcategory,
  setSelectedSubcategory,
  setSubcategories,
  subcategories,
  deleteSubcategory,
}: {
  Icon: IconType;
  selectedSubcategory: Subcategory | undefined;
  setSelectedSubcategory: React.Dispatch<
    React.SetStateAction<Subcategory | undefined>
  >;
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  subcategories: Subcategory[];
  deleteSubcategory: (subcategoryId: string) => Promise<void>;
}) {
  /**
   * Call Subcategory Dialog
   */
  const openSubcategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("subcategory_dialog")?.showModal();
  };
  return (
    <div className="dropdown dropdown-end bg-base-200 w-full">
      <div tabIndex={0} role="button" className=" btn btn-ghost w-full">
        {<Icon />} {selectedSubcategory?.label || "Select Subcategory"}
        <FaAngleDown className="text-right" />
      </div>
      <div>
        <ul
          tabIndex={0}
          className={"dropdown-content menu bg-base-200 z-[10] w-full shadow"}
        >
          {subcategories?.map((subcategory) => {
            return (
              <li
                key={`category_li_${subcategory.id}`}
                className={
                  selectedSubcategory?.id === subcategory.id
                    ? "bg-base-100 cursor-pointer p-1 w-full"
                    : "cursor-pointer p-1 w-full"
                }
              >
                <div className="flex flex-row w-full h-full">
                  <div
                    onClick={(e) => {
                      setSelectedSubcategory(subcategory);
                      //   setSubcategories(selectedSubcategory?.subcategory || []);
                      const element = document.activeElement;
                      if (element) {
                        // @ts-ignore
                        element?.blur();
                      }
                    }}
                    className="flex flex-row items-center w-full"
                  >
                    {subcategory.label}
                    {selectedSubcategory?.id === subcategory.id ? (
                      <div>
                        <MdCheck />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className="text-error hover:text-secondary"
                    onClick={() => deleteSubcategory(subcategory.id)}
                  >
                    <FaXmark />
                  </div>
                </div>
              </li>
            );
          })}
          <li
            className=" border-t-2 border-base-300"
            key={`subcategory-new`}
            onClick={openSubcategoryDialog}
          >
            <span>Add New</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SubcategoryDropdown;
