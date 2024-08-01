import Btn from "@/app/components/forms/Btn";
import Input from "@/app/components/forms/Input";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { FaPerson, FaUser } from "react-icons/fa6";
import { MdDateRange, MdPassword, MdSecurity } from "react-icons/md";

function AuthPage() {
  return (
    <main className="flex flex-row justify-center">
      <fieldset className="p-4 md:mt-5 mt-2">
        <legend>
          <h2>Register</h2>
        </legend>
        <form className="grid grid-flow-row md:grid-cols-2 grid-cols-1">
          <Input
            label={"First Name"}
            type={"text"}
            id={"firstName"}
            Icon={FaUser}
          />
          <Input
            label={"Last Name"}
            type={"text"}
            id={"lastName"}
            Icon={FaUser}
          />
          <Input label={"Birth Date"} type={"date"} id={"dob"} />
          <Input
            label={"NRC No#"}
            type={"text"}
            id={"nrcNo"}
            Icon={MdSecurity}
          />
          <Input
            label={"Password"}
            type={"password"}
            id={"password"}
            Icon={MdPassword}
          />
          <Input
            label={"Confirm Password"}
            type={"password"}
            id={"confirmPassword"}
            Icon={MdPassword}
          />
          <Btn text={"Register"} />
        </form>
      </fieldset>
    </main>
  );
}

export default AuthPage;
