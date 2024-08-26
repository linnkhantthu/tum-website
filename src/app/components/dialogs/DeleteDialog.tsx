import React from "react";
import { MdCancel, MdDelete } from "react-icons/md";
import Loading from "../Loading";

function DeleteDialog({
  uploader,
  isDeleting,
}: {
  uploader: () => Promise<void>;
  isDeleting: boolean;
}) {
  return (
    <div>
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="deleteDialog" className="modal">
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
          <div>
            <form
              method="dialog"
              className="flex flex-row w-full justify-end p-3"
            >
              <button className="btn btn-success mr-2">
                Cancel <MdCancel />
              </button>
              <button
                onClick={() => {
                  uploader();
                }}
                className="btn btn-error"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    Deleting
                    <Loading />
                  </>
                ) : (
                  <>
                    Delete <MdDelete />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default DeleteDialog;
