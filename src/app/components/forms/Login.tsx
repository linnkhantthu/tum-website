import React from "react";
import { FaUserCircle, FaUserTie } from "react-icons/fa";
import { MdEmail, MdPerson, MdSecurity, MdPassword } from "react-icons/md";
import Btn from "./Btn";
import Input from "./Input";

function LoginForm({
  isRegisterForm,
  setIsRegisterForm,
}: {
  isRegisterForm: boolean;
  setIsRegisterForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const submitForm = () => {};
  return (
    <>
      <legend>
        <h2>Login</h2>
      </legend>
      <form
        onSubmit={submitForm}
        className="grid grid-flow-row md:grid-cols-2 grid-cols-1"
      >
        <Input
          label={"Email or Username"}
          type={"text"}
          id={"email_or_username"}
          Icon={FaUserCircle}
        />
        <Input label={"Birth Date"} type={"date"} id={"dob"} />
        <Input label={"NRC No#"} type={"text"} id={"nrcNo"} Icon={MdSecurity} />
        <Input
          label={"Password"}
          type={"password"}
          id={"password"}
          Icon={MdPassword}
        />
        <span className="flex flex-row pt-3">
          <input
            className="checkbox checkbox-info"
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
          />{" "}
          <span className="pl-3 pb-3">Remember Me</span>
        </span>
        <span></span>
        <span
          className="link link-info"
          onClick={() => {
            setIsRegisterForm(!isRegisterForm);
          }}
        >
          Need an account?
        </span>
        <span></span>
        <Btn text={"Login"} />
      </form>
    </>
  );
}

export default LoginForm;
