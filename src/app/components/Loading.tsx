import React from "react";

function Loading({ label }: { label?: string }) {
  return (
    <div className="flex flex-row justify-center text-center">
      <span className="flex flex-col">
        <span>
          <span className="loading loading-bars loading-sm"></span>
        </span>
        <small>{label}</small>
      </span>
    </div>
  );
}

export default Loading;
