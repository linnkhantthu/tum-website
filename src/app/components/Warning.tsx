import React from "react";
import { MdWarning } from "react-icons/md";

function Warning({ label }: { label?: string }) {
  return (
    <div className="flex flex-row justify-center mt-5">
      <MdWarning className="text-lg mr-3" />
      {label}
    </div>
  );
}

export default Warning;
