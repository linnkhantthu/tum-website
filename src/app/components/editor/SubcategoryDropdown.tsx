"use client";

import { Category, Subcategory } from "@/lib/models";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { FaAngleDown } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdCheck, MdDelete, MdEdit } from "react-icons/md";

function SubcategoryDropdown({
  Icon,
  selectedSubcategory,
  setSelectedSubcategory,
  setSubcategories,
  subcategories,
  deleteSubcategory,
  selectedCategory,
  controller,
  setSelectedToUpdateSubcategory,
  selectedNewCategory,
  setSelectedNewCategory,
}: {
  Icon: IconType;
  selectedSubcategory: Subcategory | undefined;
  setSelectedSubcategory: React.Dispatch<
    React.SetStateAction<Subcategory | undefined>
  >;
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  subcategories: Subcategory[];
  deleteSubcategory: (subcategoryId: string) => Promise<void>;
  selectedCategory: Category | undefined;
  controller: React.Dispatch<React.SetStateAction<string>>;
  setSelectedToUpdateSubcategory: React.Dispatch<
    React.SetStateAction<Subcategory | undefined>
  >;
  selectedNewCategory: Category | undefined;
  setSelectedNewCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
}) {
  /**
   * Call Subcategory Dialog
   */
  const openSubcategoryDialog = async (isUpdate: boolean) => {
    if (isUpdate) {
      // @ts-ignore
      document.getElementById("update_subcategory_dialog")?.showModal();
    } else {
      controller("");
      // @ts-ignore
      document.getElementById("subcategory_dialog")?.showModal();
    }
  };
  return (
    <div
      className="dropdown dropdown-end bg-base-200 w-full tooltip"
      data-tip={selectedSubcategory?.label}
    >
      <div
        tabIndex={0}
        role="button"
        className=" btn btn-ghost w-full text-xs sm:text-base"
      >
        <span className=" gap-[1px] flex flex-row items-center w-full">
          <span className="w-[10%]">{<Icon />}</span>
          <span className="line-clamp-1 w-[80%]">
            {selectedSubcategory?.label || "Select Subcategory"}
          </span>
          <FaAngleDown className="text-end w-[10%]" />
        </span>
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
                    ? "bg-base-100 cursor-pointer w-full"
                    : "cursor-pointer w-full"
                }
              >
                <div className="flex flex-row w-full h-full ">
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
                    className="flex flex-row items-center w-full text-xs sm:text-base"
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
                  <div className=" gap-1 flex flex-row text-error hover:text-secondary">
                    <span
                      className="btn btn-xs btn-info"
                      onClick={() => {
                        controller(subcategory.label);
                        setSelectedToUpdateSubcategory(subcategory);
                        setSelectedNewCategory(selectedCategory);
                        openSubcategoryDialog(true);
                      }}
                    >
                      <MdEdit />
                    </span>
                    <span
                      className="btn btn-xs btn-error"
                      onClick={() => deleteSubcategory(subcategory.id)}
                    >
                      <FaXmark />
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
          {selectedCategory ? (
            <li
              className=" border-t-2 border-base-300"
              key={`subcategory-new`}
              onClick={() => openSubcategoryDialog(false)}
            >
              <span>Add New</span>
            </li>
          ) : (
            ""
          )}
        </ul>
      </div>
    </div>
  );
}

export default SubcategoryDropdown;
