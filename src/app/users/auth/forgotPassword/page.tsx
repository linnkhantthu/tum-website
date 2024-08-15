"use client";
import { FlashMessage, Results, responseModel } from "@/lib/models";
import useUser from "@/lib/useUser";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import Loading from "../../../components/Loading";
import ForgotPasswordForm from "@/app/components/ForgotPasswordForm";
import { makeid } from "@/lib/utils-fe";

function ForgotPassword() {
  const { data, isError, isLoading } = useUser();
  const [toasts, setToasts] = useState<FlashMessage[]>([]);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const formEmail = formData.get("email");
    try {
      if (formEmail !== "") {
        const res = await fetch("/api/users/forgotPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.get("email"),
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
      {isError ? (
        <span>{Results.CONNECTION_ERROR}</span>
      ) : isLoading ? (
        <Loading />
      ) : data.user === undefined ? (
        <ForgotPasswordForm
          toasts={toasts}
          handleSubmit={handleSubmit}
          setToasts={setToasts}
        />
      ) : (
        redirect("/")
      )}
    </>
  );
}

export default ForgotPassword;
