import React, { FormEvent, useState } from "react";
import { FaUserCircle, FaUserTie } from "react-icons/fa";
import { MdEmail, MdPerson, MdSecurity, MdPassword } from "react-icons/md";
import Btn from "./Btn";
import Input from "./Input";
import { FlashMessage, User } from "@/lib/models";

function RegisterForm({
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
  const [email, emailController] = useState<string>("");
  const [username, usernameController] = useState<string>("");
  const [firstName, firstNameController] = useState<string>("");
  const [lastName, lastNameController] = useState<string>("");
  const [dob, dobController] = useState<Date>();
  const [nrcNo, nrcNoController] = useState<string>("");
  const [password, passwordController] = useState<string>("");
  const [confirmPassword, confirmPasswordController] = useState<string>("");

  const [emailError, emailErrorController] = useState<string>();
  const [usernameError, usernameErrorController] = useState<string>();
  const [firstNameError, firstNameErrorController] = useState<string>();
  const [lastNameError, lastNameErrorController] = useState<string>();
  const [dobError, dobErrorController] = useState<string>();
  const [nrcNoError, nrcNoErrorController] = useState<string>();
  const [passwordError, passwordErrorController] = useState<string>();
  const [confirmPasswordError, confirmPasswordErrorController] =
    useState<string>();

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      confirmPasswordErrorController(undefined);
      console.log(dob);
      const formData = {
        email: email,
        username: username,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        nrcNo: nrcNo,
        password: password,
      };

      const res = await fetch("/api/users/register", {
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
          setFlashMessage({
            message: `Account registered as ${user.username}`,
            category: "bg-info",
          });
          setIsRegisterForm(false);
        } else {
          setFlashMessage({ message: message, category: "bg-error" });
        }
      } else {
        setFlashMessage({ message: "Connection Error", category: "bg-error" });
      }
    } else {
      // Password field error
      confirmPasswordErrorController(
        "This field must be equal with Password field."
      );
    }
  };
  return (
    <>
      <legend>
        <h2>Register</h2>
      </legend>
      <form
        onSubmit={submitForm}
        className="grid grid-flow-row md:grid-cols-2 grid-cols-1"
      >
        <Input
          label={"Email"}
          type={"email"}
          id={"email"}
          Icon={MdEmail}
          value={email}
          controller={emailController}
          error={emailError}
          errorController={emailErrorController}
        />
        <Input
          label={"Username"}
          type={"text"}
          id={"username"}
          Icon={MdPerson}
          value={username}
          controller={usernameController}
          error={usernameError}
          errorController={usernameErrorController}
        />
        <Input
          label={"First Name"}
          type={"text"}
          id={"firstName"}
          Icon={FaUserCircle}
          value={firstName}
          controller={firstNameController}
        />
        <Input
          label={"Last Name"}
          type={"text"}
          id={"lastName"}
          Icon={FaUserTie}
          value={lastName}
          controller={lastNameController}
        />
        <Input
          label={"Birth Date"}
          type={"date"}
          id={"dob"}
          value={dob}
          controller={dobController}
        />
        <Input
          label={"NRC No#"}
          type={"text"}
          id={"nrcNo"}
          Icon={MdSecurity}
          value={nrcNo}
          controller={nrcNoController}
        />
        <Input
          label={"Password"}
          type={"password"}
          id={"password"}
          Icon={MdPassword}
          value={password}
          controller={passwordController}
        />
        <Input
          label={"Confirm Password"}
          type={"password"}
          id={"confirmPassword"}
          Icon={MdPassword}
          value={confirmPassword}
          controller={confirmPasswordController}
          error={confirmPasswordError}
          errorController={confirmPasswordErrorController}
        />
        <span
          className="link link-info"
          onClick={() => {
            setIsRegisterForm(!isRegisterForm);
          }}
        >
          Already have an account?
        </span>
        <span></span>
        <Btn text={"Register"} />
      </form>
    </>
  );
}

export default RegisterForm;
