import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import Btn from "./Btn";
import Input from "./Input";

function LoginForm({
  isRegisterForm,
  setIsRegisterForm,
}: {
  isRegisterForm: boolean;
  setIsRegisterForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [emailOrUsername, emailOrUsernameController] = useState("");
  const [password, passwordController] = useState("");

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
          value={emailOrUsername}
          controller={emailOrUsernameController}
        />
        <Input
          label={"Password"}
          type={"password"}
          id={"password"}
          Icon={MdPassword}
          value={password}
          controller={passwordController}
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
