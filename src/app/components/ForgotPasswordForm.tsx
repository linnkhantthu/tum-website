import { FlashMessage } from "@/lib/models";
import React, { FormEvent, useState } from "react";
import Submit from "./forms/Submit";
import Toast from "./Toast";
import { toastOnDelete } from "@/lib/utils-fe";

function ForgotPasswordForm({
  toasts,
  handleSubmit,
  setToasts,
}: {
  toasts: FlashMessage[] | undefined;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setToasts: React.Dispatch<React.SetStateAction<FlashMessage[]>>;
}) {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmitLocal = (e: FormEvent) => {
    setIsSubmitting(true);
    handleSubmit(e).then(() => setIsSubmitting(false));
  };
  return (
    <>
      <div className="flex flex-row justify-center">
        <fieldset className="flex flex-col w-1/3">
          <legend className="flex flex-col w-full">
            <h1>Enter Email</h1>
          </legend>
          <form
            className="flex flex-col flex-none form form-control text-lg"
            onSubmit={handleSubmitLocal}
          >
            <label className="label label-text" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input input-bordered"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <Submit isSubmitting={isSubmitting} />
          </form>
        </fieldset>
      </div>
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
