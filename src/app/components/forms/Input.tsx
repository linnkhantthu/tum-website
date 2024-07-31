import React from "react";

function Input({
  label,
  type,
  id,
}: {
  label: string;
  type: string;
  id: string;
}) {
  return (
    <div className="p-1">
      <label htmlFor="lastName" className=" label label-text">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        className="input input-info w-full"
      />
      <small className="label label-text text-error">Error Text</small>
    </div>
  );
}

export default Input;
