import React from "react";
import Input from "../forms/Input";
import { MdCategory } from "react-icons/md";

function AddNewCategoryDialog({
  value,
  controller,
  error,
  errorController,
}: {
  value: string;
  controller: React.Dispatch<React.SetStateAction<string>>;
  error: string | undefined;
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="add-new-category-dialog" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add New Category</h3>
          <p>
            <form className="grid grid-flow-row grid-cols-1">
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
          </p>
        </div>
      </dialog>
    </div>
  );
}

export default AddNewCategoryDialog;
