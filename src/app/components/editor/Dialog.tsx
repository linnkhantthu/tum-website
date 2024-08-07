import React from "react";

function Dialog({
  uploader,
}: {
  uploader: (
    isPublished: boolean | undefined,
    isSave: boolean
  ) => Promise<boolean>;
}) {
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
          <h3 className="font-bold text-lg">Ready to publish?</h3>
          <p className="">
            <form method="dialog" className="flex flex-row w-full justify-end">
              <button className="btn btn-error btn-sm mr-2">Cancel</button>
              <button
                onClick={() => {
                  uploader(true, false);
                }}
                className="btn btn-success btn-sm"
              >
                Publish
              </button>
            </form>
          </p>
        </div>
      </dialog>
    </div>
  );
}

export default Dialog;
