import Btn from "@/app/components/forms/Btn";
import Input from "@/app/components/forms/Input";
import React from "react";

function AuthPage() {
  return (
    <main className="flex flex-row justify-center">
      <fieldset className="p-4 md:mt-5 mt-2">
        <legend>
          <h2>Register</h2>
        </legend>
        <form className="grid grid-flow-row md:grid-cols-2 grid-cols-1">
          <Input label={"First Name"} type={"text"} id={"firstName"} />
          <Input label={"Last Name"} type={"text"} id={"lastName"} />
          <Input label={"Birth Date"} type={"date"} id={"dob"} />
          <Input label={"Password"} type={"password"} id={"password"} />
          <Input
            label={"Confirm Password"}
            type={"password"}
            id={"confirmPassword"}
          />
          <div></div>
          <Btn text={"Register"} />
        </form>
      </fieldset>
    </main>
  );
}

export default AuthPage;
