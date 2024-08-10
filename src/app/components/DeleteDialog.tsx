import React from "react";

function DeleteDialog({ uploader }: { uploader: () => Promise<void> }) {
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">
            Are you sure that you want to delete this article?
          </h3>
          <p className="">
            <form method="dialog" className="flex flex-row w-full justify-end">
              <button className="btn btn-success btn-sm mr-2">Cancel</button>
              <button
                onClick={() => {
                  uploader();
                }}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
            </form>
          </p>
        </div>
      </dialog>
    </div>
  );
}

export default DeleteDialog;
