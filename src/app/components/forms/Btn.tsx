import React from "react";
import { MdAdsClick } from "react-icons/md";

function Btn({ text }: { text: string }) {
  return (
    <button type="submit" className="btn btn-info mt-5 ">
      {text} <MdAdsClick />
    </button>
  );
}

export default Btn;
