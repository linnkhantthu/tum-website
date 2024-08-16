import { FlashMessage } from "@/lib/models";
import React, { FormEvent, useState } from "react";
import Submit from "./Submit";
import Toast from "../Toast";
import { makeid, toastOnDelete } from "@/lib/utils-fe";

function PasswordResetForm({
  toasts,
  handleSubmit,
  fetchedToken,
  setToasts,
}: {
  toasts: FlashMessage[] | undefined;
  handleSubmit: (e: FormEvent, token: string) => Promise<void>;
  fetchedToken: string | undefined;
  setToasts: React.Dispatch<React.SetStateAction<FlashMessage[]>>;
}) {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitLocal = (e: FormEvent) => {
    e.preventDefault();
    if (fetchedToken !== undefined) {
      if (password === confirmPassword) {
        setIsSubmitting(true);
        handleSubmit(e, fetchedToken).then(() => {
          setIsSubmitting(false);
        });
      } else {
        const toast: FlashMessage = {
          id: makeid(10),
          message: "Password fields must be the same.",
          category: "alert-error",
        };
        setToasts([toast]);
      }
    } else {
      const toast: FlashMessage = {
        id: makeid(10),
        message: "Invalid Token",
        category: "alert-error",
      };
      setToasts([toast]);
    }
  };
  return (
    <>
      <div className="flex flex-row justify-center m-2 w-screen">
        <fieldset className="flex flex-col w-1/3">
          <legend className="flex flex-col w-full">
            <h1>Reset Passsword</h1>
          </legend>
          <form
            className="flex flex-col flex-none form form-control text-lg"
            onSubmit={handleSubmitLocal}
          >
            <label className="label label-text" htmlFor="email">
              New Password
            </label>
            <input
              id="password"
              className="input input-bordered"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />

            <label className="label label-text" htmlFor="email">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              className="input input-bordered"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
            {confirmPassword !== password ? (
              <small className="text-red-600">
                Confirm Password much equal to Password
              </small>
            ) : (
              ""
            )}

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

export default PasswordResetForm;
