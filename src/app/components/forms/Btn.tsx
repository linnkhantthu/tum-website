import React from "react";
import { MdAdsClick } from "react-icons/md";

function Btn({ text }: { text: string }) {
  return (
    <button type="submit" className="btn btn-info">
      Register <MdAdsClick />
    </button>
  );
}

export default Btn;
