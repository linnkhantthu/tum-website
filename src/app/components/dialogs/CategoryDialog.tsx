import React, { Dispatch, FormEvent, SetStateAction } from "react";
import Input from "../forms/Input";
import { MdCategory } from "react-icons/md";
import { Category } from "@/lib/models";

function CategoryDialog({
  value,
  controller,
  error,
  errorController,
  handleSubmit,
  isSpecial,
  isSpecialController,
  isUpdate,
  handleUpdateCategorySubmit,
  selectedToUpdateCategory,
}: {
  value: string;
  controller: React.Dispatch<React.SetStateAction<string>>;
  error: string | undefined;
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isSpecial: boolean;
  isSpecialController: Dispatch<SetStateAction<boolean>>;
  isUpdate: boolean;
  handleUpdateCategorySubmit: (
    e: FormEvent,
    categoryId: string
  ) => Promise<void>;
  selectedToUpdateCategory: Category | undefined;
}) {
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      {/* Dialog */}
      <dialog
        id={isUpdate ? "update_category_dialog" : "category_dialog"}
        className="modal"
      >
        <div className="modal-box w-[80%]">
          {/* Btn - close the dialog */}
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle absolute right-2 top-2">
              ✕
            </button>
          </form>

          {/* Dialog Title */}
          <h3 className="font-bold text-lg">
            {isUpdate ? "Update Category: " : "Add New Category"}
          </h3>

          {/* Dialog Form */}
          <div>
            <form
              onSubmit={(e) =>
                isUpdate
                  ? handleUpdateCategorySubmit(e, selectedToUpdateCategory?.id!)
                  : handleSubmit(e)
              }
              className="grid grid-cols-1 gap-1"
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

              <div className="flex flex-row items-center">
                <input
                  type="checkbox"
                  className="checkbox checkbox-info"
                  name="isSpecial_checkbox"
                  id="isSpecial_checkbox"
                  onChange={(e) => isSpecialController(e.target.checked)}
                  checked={isSpecial}
                />
                <label
                  htmlFor="isSpecial_checkbox"
                  className=" label label-text"
                >
                  Show on navigation bar?
                </label>
              </div>
              <div className="mt-2">
                <span
                  className="btn btn-error mr-2"
                  onClick={() =>
                    document
                      .getElementById(
                        isUpdate ? "update_category_dialog" : "category_dialog"
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

export default CategoryDialog;
