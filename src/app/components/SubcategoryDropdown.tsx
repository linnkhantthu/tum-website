"use client";

import { Subcategory } from "@/lib/models";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { MdCheck } from "react-icons/md";

function SubcategoryDropdown({
  Icon,
  selectedSubcategory,
  setSelectedSubcategory,
  setSubcategories,
  subcategories,
}: {
  Icon: IconType;
  selectedSubcategory: Subcategory | undefined;
  setSelectedSubcategory: React.Dispatch<
    React.SetStateAction<Subcategory | undefined>
  >;
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  subcategories: Subcategory[];
}) {
  return (
    <div className="dropdown dropdown-end bg-base-200 w-full">
      <div
        tabIndex={0}
        role="button"
        className=" justify-start btn btn-ghost btn-sm w-full"
      >
        {<Icon />} {selectedSubcategory?.label || "Category"}
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
                    ? "bg-base-100 cursor-pointer p-1"
                    : "cursor-pointer p-1"
                }
                onClick={() => {
                  setSelectedSubcategory(subcategory);
                  //   setSubcategories(selectedSubcategory?.subcategory || []);
                  const element = document.activeElement;
                  if (element) {
                    // @ts-ignore
                    element?.blur();
                  }
                }}
              >
                <span>
                  {subcategory.label}
                  {selectedSubcategory?.id === subcategory.id ? (
                    <MdCheck />
                  ) : (
                    ""
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SubcategoryDropdown;
