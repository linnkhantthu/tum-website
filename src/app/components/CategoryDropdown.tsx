"use client";

import { Category, Subcategory } from "@/lib/models";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { MdCheck } from "react-icons/md";

function CategoryDropdown({
  Icon,
  selectedCategory,
  setSelectedCategory,
  setSubcategories,
  categories,
}: {
  Icon: IconType;
  selectedCategory: Category | undefined;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  categories: Category[];
}) {
  return (
    <div className="dropdown dropdown-end bg-base-200 w-full">
      <div
        tabIndex={0}
        role="button"
        className=" justify-start btn btn-ghost btn-sm w-full"
      >
        {<Icon />} {selectedCategory?.label || "Category"}
      </div>
      <div>
        <ul
          tabIndex={0}
          className={"dropdown-content menu bg-base-200 z-[10] w-full shadow"}
        >
          {categories?.map((category) => {
            return (
              <li
                key={`category_li_${category.id}`}
                className={
                  selectedCategory?.id === category.id
                    ? "bg-base-100 cursor-pointer p-1"
                    : "cursor-pointer p-1"
                }
                onClick={() => {
                  setSelectedCategory(category);
                  setSubcategories(selectedCategory?.subcategory || []);
                  const element = document.activeElement;
                  if (element) {
                    // @ts-ignore
                    element?.blur();
                  }
                }}
              >
                <span>
                  {category.label}
                  {selectedCategory?.id === category.id ? <MdCheck /> : ""}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default CategoryDropdown;
