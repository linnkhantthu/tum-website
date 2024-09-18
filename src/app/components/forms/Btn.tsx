import React from "react";
import { MdAdsClick } from "react-icons/md";
import Loading from "../Loading";

function Btn({ text, isSubmitting }: { text: string; isSubmitting?: boolean }) {
  return (
    <button
      type="submit"
      className="btn btn-info mt-5 "
      disabled={isSubmitting}
    >
      {text} {isSubmitting ? <Loading /> : <MdAdsClick />}
    </button>
  );
}

export default Btn;
