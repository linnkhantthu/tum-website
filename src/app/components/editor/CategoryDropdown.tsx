"use client";

import { Category, Subcategory } from "@/lib/models";
import { Dispatch, SetStateAction } from "react";
import { IconType } from "react-icons";
import { FaAngleDown } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { MdCheck, MdEdit, MdNewLabel } from "react-icons/md";

function CategoryDropdown({
  Icon,
  selectedCategory,
  setSelectedCategory,
  setSubcategories,
  categories,
  setSelectedSubcategory,
  deleteCategory,
  isSpecialController,
  controller,
  setSelectedToUpdateCategory,
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
  deleteCategory: (categoryId: string) => Promise<void>;
  isSpecialController: React.Dispatch<React.SetStateAction<boolean>>;
  controller: React.Dispatch<React.SetStateAction<string>>;
  setSelectedToUpdateCategory: Dispatch<SetStateAction<Category | undefined>>;
}) {
  /**
   * Call Category Dialog
   */
  const openCategoryDialog = async (isUpdate: boolean) => {
    if (isUpdate) {
      // @ts-ignore
      document.getElementById("update_category_dialog")?.showModal();
    } else {
      controller("");
      isSpecialController(false);
      // @ts-ignore
      document.getElementById("category_dialog")?.showModal();
    }
  };
  return (
    <div
      className="dropdown dropdown-end bg-base-200 w-full tooltip"
      data-tip={selectedCategory?.label}
    >
      <div
        tabIndex={0}
        role="button"
        className=" btn btn-ghost w-full text-xs sm:text-base"
      >
        <span className="gap-[1px] flex flex-row items-center w-full">
          <span className="w-[10%]">{<Icon />}</span>
          <span className="line-clamp-1 w-[80%]">
            {selectedCategory?.label || "Select Category"}
          </span>
          <FaAngleDown className="text-end w-[10%]" />
        </span>
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
                      setSelectedSubcategory(undefined);
                      setSubcategories(category?.subcategory!);
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
                  <div className=" gap-1 flex flex-row text-error hover:text-secondary">
                    <span
                      className="btn btn-xs btn-info"
                      onClick={() => {
                        controller(category.label);
                        isSpecialController(category.isSpecial);
                        setSelectedToUpdateCategory(category);
                        openCategoryDialog(true);
                      }}
                    >
                      <MdEdit />
                    </span>
                    <span
                      className="btn btn-xs btn-error"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <FaXmark />
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
          <li
            className=" border-t-2 border-base-300"
            key={`category-new`}
            onClick={() => openCategoryDialog(false)}
          >
            <span>
              <MdNewLabel /> Add New
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CategoryDropdown;
