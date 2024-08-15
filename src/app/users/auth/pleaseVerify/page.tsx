"use client";

import useUser from "@/lib/useUser";
import React, { useState } from "react";
import Loading from "../../../components/Loading";
import { redirect } from "next/navigation";
import { FlashMessage, responseModel } from "@/lib/models";
import FlashMsg from "@/app/components/FlashMsg";
import Toast from "@/app/components/Toast";
import { makeid, toastOnDelete } from "@/lib/utils-fe";

function PleaseVerify() {
  const { data: userData, isLoading, isError } = useUser();
  const [toasts, setToasts] = useState<FlashMessage[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const handleClick = async () => {
    setIsRequesting(true);
    try {
      const res = await fetch("/api/users/askVerifyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data: responseModel = await res.json();
        if (data.isSuccess) {
          setToasts([
            {
              id: makeid(10),
              message:
                "We have sent a verification link to " + data.data?.email,
              category: "alert-info",
            },
          ]);
        } else {
          setToasts([
            {
              id: makeid(10),
              message:
                "Failed to send a verification link to " + data.data?.email,
              category: "bg-error",
            },
          ]);
        }
        setIsRequesting(false);
      } else {
        redirect("/users/auth");
      }
    } catch (error: any) {
      setToasts([
        {
          id: makeid(10),
          message: error.message,
          category: "bg-error",
        },
      ]);
    }
  };
  return isLoading || isError ? (
    <Loading />
  ) : userData?.user?.verified || !userData?.user ? (
    redirect("/")
  ) : (
    <>
      <div className="flex flex-row justify-center h-full mt-3">
        <span className=" flex flex-col justify-center">
          <span>We have send an verification email to your mail.</span>
          <span>Please verify to continue.</span>
          <span className="link link-success" onClick={handleClick}>
            {isRequesting ? (
              <small className=" float-left">
                <Loading />
              </small>
            ) : (
              "Request verification link"
            )}
          </span>
        </span>
      </div>
      <div className="toast toast-start w-full">
        {toasts.map((value) => (
          <Toast
            key={`toastId-${value.id}`}
            flashMessage={value}
            onDelete={() => toastOnDelete(value.id, toasts, setToasts)}
          />
        ))}
      </div>
    </>
  );
}

export default PleaseVerify;
