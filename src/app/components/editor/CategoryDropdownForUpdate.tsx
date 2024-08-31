"use client";

import { Category } from "@/lib/models";
import { IconType } from "react-icons";
import { FaAngleDown } from "react-icons/fa";
import { MdCheck } from "react-icons/md";

function CategoryDropdownForUpdate({
  Icon,
  selectedCategory,
  setSelectedCategory,
  categories,
}: {
  Icon: IconType;
  selectedCategory: Category | undefined;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
  categories?: Category[];
}) {
  return (
    <div className="dropdown dropdown-end bg-base-200 w-full">
      <div
        tabIndex={0}
        role="button"
        className=" btn btn-ghost w-full text-xs sm:text-base"
      >
        {<Icon />} {selectedCategory?.label || "Select Category"}
        <FaAngleDown className="text-right" />
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
                  (selectedCategory?.id === category.id
                    ? "bg-base-100 cursor-pointer p-1"
                    : "cursor-pointer p-1") +
                  (category.isSpecial ? " text-warning" : "")
                }
              >
                <div className="flex flex-row w-full h-full">
                  <div
                    onClick={() => {
                      setSelectedCategory(category);
                      const element = document.activeElement;
                      if (element) {
                        // @ts-ignore
                        element?.blur();
                      }
                    }}
                    className="flex flex-row items-center w-full text-xs sm:text-base"
                  >
                    {category.label}
                    {selectedCategory?.id === category.id ? (
                      <div>
                        <MdCheck />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default CategoryDropdownForUpdate;
