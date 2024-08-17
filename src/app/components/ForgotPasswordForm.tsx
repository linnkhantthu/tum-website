import { FlashMessage, responseModel } from "@/lib/models";
import React, { FormEvent, useState } from "react";
import Submit from "./forms/Submit";
import Toast from "./Toast";
import { makeid, toastOnDelete } from "@/lib/utils-fe";
import Input from "./forms/Input";
import { MdEmail } from "react-icons/md";
import Btn from "./forms/Btn";
import { emailValidator } from "@/lib/validators";

function ForgotPasswordForm({}) {
  const [email, emailController] = useState<string>("");
  const [emailError, emailErrorController] = useState<string>();

  const [toasts, setToasts] = useState<FlashMessage[]>([]);

  /**
   * Handle Forget Password Submit
   * @param e
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    emailErrorController(undefined);
    try {
      if (email !== "") {
        if (emailValidator(email, emailErrorController)) {
          const res = await fetch("/api/users/forgotPassword", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          });
          const { data, isSuccess, message }: responseModel = await res.json();
          if (res.ok && isSuccess && data?.email && message) {
            setToasts([
              {
                id: makeid(10),
                message: message,
                category: "alert-success",
              },
            ]);
          } else {
            throw new Error(message);
          }
        }
      } else {
        setToasts([
          {
            id: makeid(10),
            message: "Please fill in the field.",
            category: "alert-error",
          },
        ]);
      }
    } catch (error: any) {
      setToasts([
        {
          id: makeid(10),
          message: error.message,
          category: "alert-error",
        },
      ]);
    }
  };
  return (
    <>
      <legend className="flex flex-col w-full">
        <h1>Enter Email</h1>
      </legend>
      <form
        className="flex flex-col flex-none form form-control text-lg"
        onSubmit={handleSubmit}
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

export default ForgotPasswordForm;
