"use client";

import { Category, Subcategory } from "@/lib/models";
import { IconType } from "react-icons";
import { FaAngleDown } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdCheck } from "react-icons/md";

function CategoryDropdown({
  Icon,
  selectedCategory,
  setSelectedCategory,
  setSubcategories,
  categories,
  setSelectedSubcategory,
}: {
  Icon: IconType;
  selectedCategory: Category | undefined;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
  setSubcategories: React.Dispatch<React.SetStateAction<Subcategory[]>>;
  categories: Category[];
  setSelectedSubcategory: React.Dispatch<
    React.SetStateAction<Subcategory | undefined>
  >;
}) {
  /**
   * Call Category Dialog
   */
  const openCategoryDialog = async () => {
    // @ts-ignore
    document.getElementById("category_dialog")?.showModal();
  };
  return (
    <div className="dropdown dropdown-end bg-base-200 w-full">
      <div tabIndex={0} role="button" className=" btn btn-ghost w-full">
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
                  selectedCategory?.id === category.id
                    ? "bg-base-100 cursor-pointer p-1"
                    : "cursor-pointer p-1"
                }
              >
                <div className="flex flex-row w-full h-full">
                  <div
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubcategory(undefined);
                      setSubcategories(category?.subcategory!);
                      const element = document.activeElement;
                      if (element) {
                        // @ts-ignore
                        element?.blur();
                      }
                    }}
                    className="flex flex-row items-center w-full"
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
                  <div
                    className="text-error hover:text-secondary"
                    onClick={() => console.log("Clicked delete")}
                  >
                    <FaXmark />
                  </div>
                </div>
              </li>
            );
          })}
          <li
            className=" border-t-2 border-base-300"
            key={`category-new`}
            onClick={openCategoryDialog}
          >
            <span>Add New</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CategoryDropdown;
