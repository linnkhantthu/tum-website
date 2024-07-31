import React from "react";

function Btn({ text }: { text: string }) {
  return (
    <button type="submit" className="btn btn-info">
      Register
    </button>
  );
}

export default Btn;
