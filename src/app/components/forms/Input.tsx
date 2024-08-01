import React from "react";
import { IconType } from "react-icons";

function Input({
  label,
  type,
  id,
  Icon,
  value,
  controller,
}: {
  label: string;
  type: string;
  id: string;
  Icon?: IconType;
  value: any;
  controller: React.Dispatch<React.SetStateAction<any>>;
}) {
  return (
    <div className="p-1">
      <label htmlFor={id} className=" label label-text">
        {label}
      </label>
      <i className="absolute mt-4 ml-3">{Icon ? <Icon /> : ""}</i>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={(e) => controller(e.currentTarget.value)}
        className="input input-info w-full px-10"
      />
      {/* <small className="label label-text text-error">Error Text</small> */}
    </div>
  );
}

export default Input;
