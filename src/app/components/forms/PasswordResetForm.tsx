import { FlashMessage } from "@/lib/models";
import React, { FormEvent, useState } from "react";
import Submit from "./Submit";
import Toast from "../Toast";
import { makeid, toastOnDelete } from "@/lib/utils-fe";
import Input from "./Input";
import { MdPassword } from "react-icons/md";
import Btn from "./Btn";
import { confirmPasswordValidator, passwordValidator } from "@/lib/validators";

function PasswordResetForm({
  toasts,
  fetchedToken,
  setToasts,
  setIsSubmitted,
  setIsResetted,
}: {
  toasts: FlashMessage[] | undefined;
  fetchedToken: string | undefined;
  setToasts: React.Dispatch<React.SetStateAction<FlashMessage[]>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsResetted: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [password, passwordController] = useState<string>("");
  const [confirmPassword, confirmPasswordController] = useState("");
  const [passwordError, passwordErrorController] = useState<string>();
  const [confirmPasswordError, confirmPasswordErrorController] =
    useState<string>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      passwordValidator(password, passwordErrorController) &&
      confirmPasswordValidator(
        password,
        confirmPassword,
        confirmPasswordErrorController
      )
    ) {
      const res = await fetch("/api/users/forgotPassword/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: fetchedToken, password: password }),
      });
      const { email, message } = await res.json();
      if (res.ok) {
        if (email) {
          setIsResetted(true);
          setIsSubmitted(true);
          setToasts([
            {
              id: makeid(10),
              message: message,
              category: "alert-error",
            },
          ]);
        } else {
          setToasts([
            {
              id: makeid(10),
              message: message,
              category: "alert-error",
            },
          ]);
          setIsResetted(false);
          setIsSubmitted(true);
        }
      }
    }
  };
  return (
    <>
      <legend className="flex flex-col w-full">
        <h1>Reset Passsword</h1>
      </legend>
      <form
        onSubmit={handleSubmit}
        className="grid grid-flow-row md:grid-cols-2 grid-cols-1"
      >
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

        <Btn text={"Submit"} />
      </form>
      <div className="toast toast-start">
        {toasts?.map((toast) => (
          <Toast
            key={`toastId-${toast.id}`}
            flashMessage={toast}
            onDelete={() => toastOnDelete(toast.id, toasts, setToasts)}
          />
        ))}
      </div>
    </>
  );
}

export default PasswordResetForm;
