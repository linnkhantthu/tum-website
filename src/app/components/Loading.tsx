import React from "react";

function Loading({ label }: { label?: string }) {
  return (
    <div className="flex flex-row justify-center">
      <span className="flex flex-col justify-center">
        <span className="loading loading-bars loading-sm"></span>
        <small>{label}</small>
      </span>
    </div>
  );
}

export default Loading;
