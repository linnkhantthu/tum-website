import React, { Dispatch, FormEvent, SetStateAction } from "react";
import Input from "../forms/Input";
import { MdCategory } from "react-icons/md";

function CategoryDialog({
  value,
  controller,
  error,
  errorController,
  handleSubmit,
  isSpecial,
  isSpecialController,
}: {
  value: string;
  controller: React.Dispatch<React.SetStateAction<string>>;
  error: string | undefined;
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  isSpecial: boolean;
  isSpecialController: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="category_dialog" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add New Category</h3>

          <div>
            <form onSubmit={handleSubmit} className="grid grid-cols-2">
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

              <div className="p-1">
                <div className=" w-full flex flex-row justify-center items-center mt-10">
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
                    Show on Navigation Bar?
                  </label>
                </div>
              </div>
              <div className="mt-2">
                <span className="btn btn-error mr-2">Cancel</span>
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
