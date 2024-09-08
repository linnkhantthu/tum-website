import React, { FormEvent, useState } from "react";
import Input from "../forms/Input";
import { MdCategory } from "react-icons/md";
import { Category, Subcategory } from "@/lib/models";
import CategoryDropdownForUpdate from "../editor/CategoryDropdownForUpdate";

function SubcategoryDialog({
  value,
  controller,
  error,
  errorController,
  handleSubmit,
  selectedCategory,
  isUpdate,
  handleUpdateSubcategorySubmit,
  selectedToUpdateSubcategory,
  categories,
  selectedNewCategory,
  setSelectedNewCategory,
}: {
  value: string;
  controller: React.Dispatch<React.SetStateAction<string>>;
  error: string | undefined;
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  selectedCategory: Category | undefined;
  isUpdate: boolean;
  handleUpdateSubcategorySubmit: (
    e: FormEvent,
    subcategoryId: string
  ) => Promise<void>;
  selectedToUpdateSubcategory: Subcategory | undefined;
  categories?: Category[];
  selectedNewCategory: Category | undefined;
  setSelectedNewCategory: React.Dispatch<
    React.SetStateAction<Category | undefined>
  >;
}) {
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog
        id={isUpdate ? "update_subcategory_dialog" : "subcategory_dialog"}
        className="modal"
      >
        <div className="modal-box w-[80%]">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle absolute right-2 top-2 z-20">
              ✕
            </button>
          </form>
          {isUpdate ? (
            <CategoryDropdownForUpdate
              Icon={MdCategory}
              selectedCategory={selectedNewCategory}
              setSelectedCategory={setSelectedNewCategory}
              categories={categories}
            />
          ) : (
            <h3 className="font-bold text-lg">
              Add Subcategory under: {selectedCategory?.label}?
            </h3>
          )}

          <div>
            <form
              onSubmit={
                isUpdate
                  ? (e) => {
                      handleUpdateSubcategorySubmit(
                        e,
                        selectedToUpdateSubcategory?.id!
                      );
                    }
                  : handleSubmit
              }
              className="grid grid-flow-row grid-cols-1"
            >
              <Input
                label={"Category Name"}
                type={"text"}
                id={"categoryName"}
                value={value}
                Icon={MdCategory}
                controller={controller}
                error={error}
                errorController={errorController}
              />
              <div className="mt-2">
                <span
                  className="btn btn-error mr-2"
                  onClick={() =>
                    document
                      .getElementById(
                        isUpdate
                          ? "update_subcategory_dialog"
                          : "subcategory_dialog"
                      )
                      // @ts-ignore
                      ?.close()
                  }
                >
                  Cancel
                </span>
                <button className="btn btn-success">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default SubcategoryDialog;
