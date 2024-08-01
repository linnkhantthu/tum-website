import React, { FormEvent, useState } from "react";
import { FaUserCircle, FaUserTie } from "react-icons/fa";
import { MdEmail, MdPerson, MdSecurity, MdPassword } from "react-icons/md";
import Btn from "./Btn";
import Input from "./Input";
import { User } from "@/lib/models";

function RegisterForm({
  isRegisterForm,
  setIsRegisterForm,
}: {
  isRegisterForm: boolean;
  setIsRegisterForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [email, emailController] = useState<string>("");
  const [username, usernameController] = useState<string>("");
  const [firstName, firstNameController] = useState<string>("");
  const [lastName, lastNameController] = useState<string>("");
  const [bod, bodController] = useState<Date>();
  const [nrcNo, nrcNoController] = useState<string>("");
  const [password, passwordController] = useState<string>("");
  const [confirmPassword, confirmPasswordController] = useState<string>("");

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    const formData = {
      email: email,
      username: username,
      firstName: firstName,
      lastName: lastName,
      bod: bod,
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
        // flash the message
        setIsRegisterForm(false);
      }
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
        />
        <Input
          label={"Username"}
          type={"text"}
          id={"username"}
          Icon={MdPerson}
          value={username}
          controller={usernameController}
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
          value={bod}
          controller={bodController}
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
