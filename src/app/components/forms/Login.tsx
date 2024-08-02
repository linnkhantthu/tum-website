import React, { FormEvent, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import Btn from "./Btn";
import Input from "./Input";
import { FlashMessage, User } from "@/lib/models";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";

function LoginForm({
  isRegisterForm,
  setIsRegisterForm,
  setFlashMessage,
}: {
  isRegisterForm: boolean;
  setIsRegisterForm: React.Dispatch<React.SetStateAction<boolean>>;
  setFlashMessage: React.Dispatch<
    React.SetStateAction<FlashMessage | undefined>
  >;
}) {
  const { data, mutateUser } = useUser();
  const { push } = useRouter();
  const [emailOrUsername, emailOrUsernameController] = useState("");
  const [password, passwordController] = useState("");

  const [emailOrUsernameError, emailOrUsernameErrorController] = useState();
  const [passwordError, passwordErrorController] = useState();

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    const formData = {
      emailOrUsername: emailOrUsername,
      password: password,
    };
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      const { user, message }: { user: User; message: string } =
        await res.json();
      if (user) {
        // Logged in successfully
        await mutateUser({ ...data, user: user });
        push("/");
      } else {
        setFlashMessage({ message: message, category: "bg-error" });
      }
    } else {
      setFlashMessage({
        message: `Connection error, status code is ${res.status}`,
        category: "bg-info",
      });
    }
  };
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
