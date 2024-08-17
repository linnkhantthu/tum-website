import React from "react";
import { IconType } from "react-icons";

function Input({
  label,
  type,
  id,
  Icon,
  value,
  controller,
  error,
  errorController,
  validator,
}: {
  label: string;
  type: string;
  id: string;
  Icon?: IconType;
  value: any;
  controller: React.Dispatch<React.SetStateAction<any>>;
  error?: string;
  errorController?: React.Dispatch<React.SetStateAction<string | undefined>>;
  validator?: any;
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
        onChange={(e) => {
          controller(e.target.value);
        }}
        className="input input-info w-full px-10"
        required
      />
      {error ? (
        <small className="label label-text text-error">{error}</small>
      ) : (
        ""
      )}
    </div>
  );
}

export default Input;
