import React from "react";
import { IconType } from "react-icons";

function Input({
  label,
  type,
  id,
  Icon,
}: {
  label: string;
  type: string;
  id: string;
  Icon?: IconType;
}) {
  return (
    <div className="p-1">
      <label htmlFor="lastName" className=" label label-text">
        {label}
      </label>
      <i className="absolute mt-4 ml-3">{Icon ? <Icon /> : ""}</i>
      <input
        type={type}
        id={id}
        name={id}
        className="input input-info w-full px-10"
      />
      <small className="label label-text text-error">Error Text</small>
    </div>
  );
}

export default Input;
