import React, { FormEvent } from "react";
import Input from "../forms/Input";
import { MdCategory } from "react-icons/md";

function CategoryDialog({
  value,
  controller,
  error,
  errorController,
  handleSubmit,
}: {
  value: string;
  controller: React.Dispatch<React.SetStateAction<string>>;
  error: string | undefined;
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
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
            <form
              onSubmit={handleSubmit}
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
