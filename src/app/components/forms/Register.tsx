import React, { FormEvent, useState } from "react";
import { FaUserCircle, FaUserTie } from "react-icons/fa";
import { MdEmail, MdPerson, MdSecurity, MdPassword } from "react-icons/md";
import Btn from "./Btn";
import Input from "./Input";
import { FlashMessage, User } from "@/lib/models";
import { makeid } from "@/lib/utils-fe";
import {
  emailValidator,
  usernameValidator,
  dobValidator,
  nrcNoValidator,
  passwordValidator,
  confirmPasswordValidator,
} from "@/lib/validators";

function RegisterForm({
  isRegisterForm,
  setIsRegisterForm,
  setToasts,
}: {
  isRegisterForm: boolean;
  setIsRegisterForm: React.Dispatch<React.SetStateAction<boolean>>;
  setToasts: React.Dispatch<React.SetStateAction<FlashMessage[]>>;
}) {
  const [email, emailController] = useState<string>("");
  const [username, usernameController] = useState<string>("");
  const [firstName, firstNameController] = useState<string>("");
  const [lastName, lastNameController] = useState<string>("");
  const now = new Date();
  now.setFullYear(now.getFullYear() - 12);
  const [dob, dobController] = useState<string>(
    now.toISOString().split("T")[0]
  );
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

  /**
   * Submit Registration form
   * @param e
   */
  const submitForm = async (e: FormEvent) => {
    emailErrorController(undefined);
    usernameErrorController(undefined);
    firstNameErrorController(undefined);
    lastNameErrorController(undefined);
    dobErrorController(undefined);
    nrcNoErrorController(undefined);
    passwordErrorController(undefined);
    confirmPasswordErrorController(undefined);
    e.preventDefault();
    if (
      email !== "" &&
      username !== "" &&
      firstName !== "" &&
      lastName !== "" &&
      dob &&
      nrcNo !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (
        emailValidator(email, emailErrorController) &&
        usernameValidator(username, usernameErrorController) &&
        dobValidator(dob, dobErrorController) &&
        nrcNoValidator(nrcNo, nrcNoErrorController) &&
        passwordValidator(password, passwordErrorController) &&
        confirmPasswordValidator(
          password,
          confirmPassword,
          confirmPasswordErrorController
        )
      ) {
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
            setToasts([
              {
                id: makeid(10),
                message: `Account registered as ${user.username}`,
                category: "bg-info",
              },
            ]);
            setIsRegisterForm(false);
          } else {
            setToasts([
              {
                id: makeid(10),
                message: message,
                category: "bg-error",
              },
            ]);
          }
        } else {
          setToasts([
            {
              id: makeid(10),
              message: "Connection Error",
              category: "bg-error",
            },
          ]);
        }
      }
      // Go on
    } else {
      setToasts([
        {
          id: makeid(10),
          message: "All the field must be filled.",
          category: "bg-error",
        },
      ]);
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
          error={firstNameError}
          errorController={firstNameErrorController}
        />
        <Input
          label={"Last Name"}
          type={"text"}
          id={"lastName"}
          Icon={FaUserTie}
          value={lastName}
          controller={lastNameController}
          error={lastNameError}
          errorController={lastNameErrorController}
        />
        <Input
          label={"Birth Date"}
          type={"date"}
          id={"dob"}
          value={dob}
          controller={dobController}
          error={dobError}
          errorController={dobErrorController}
        />
        <Input
          label={"NRC No#"}
          type={"text"}
          id={"nrcNo"}
          Icon={MdSecurity}
          value={nrcNo}
          controller={nrcNoController}
          error={nrcNoError}
          errorController={nrcNoErrorController}
        />
        <Input
          label={"Password"}
          type={"password"}
          id={"password"}
          Icon={MdPassword}
          value={password}
          controller={passwordController}
          error={passwordError}
          errorController={passwordErrorController}
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
