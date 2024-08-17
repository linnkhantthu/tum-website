"use client";

import Loading from "@/app/components/Loading";
import { FlashMessage } from "@/lib/models";
import useUser from "@/lib/useUser";
import React, { FormEvent, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import PasswordResetForm from "@/app/components/forms/PasswordResetForm";
import Toast from "@/app/components/Toast";
import { makeid, toastOnDelete } from "@/lib/utils-fe";

function VerifyResetPasswordToken({ params }: { params: { token: string } }) {
  const { data, isError, isLoading: isUserLoading } = useUser();
  const [isLoading, setIsLoading] = useState(true); // To check if the verifyToken function finished
  const [isVerified, setIsVerified] = useState(false); // To Verify the token is correct
  const [toasts, setToasts] = useState<FlashMessage[]>([]);
  const [fetchedToken, setFetchedToken] = useState<string | undefined>(
    undefined
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isResetted, setIsResetted] = useState(false);

  /**
   * Check Token with Server
   * @param token
   */
  async function verifyToken(token: string) {
    const res = await fetch("/api/users/forgotPassword/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }), // Send Token
    });
    const { token: fetchedToken, message } = await res.json();
    if (res.ok) {
      if (fetchedToken) {
        setToasts([
          {
            id: makeid(10),
            message: message,
            category: "alert-success",
          },
        ]);
        setFetchedToken(fetchedToken);
        setIsVerified(true);
      } else {
        setToasts([
          {
            id: makeid(10),
            message: message,
            category: "alert-error",
          },
        ]);
      }
    } else {
      setToasts([
        {
          id: makeid(10),
          message: message,
          category: "alert-error",
        },
      ]);
    }
  }

  useEffect(() => {
    try {
      // Check if the token is correct
      verifyToken(params.token);
    } catch (error: any) {
      setToasts([
        {
          id: makeid(10),
          message: error.message,
          category: "alert-error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [params.token]);
  return (
    <>
      {isUserLoading || isError ? (
        <Loading />
      ) : data?.user ? (
        <div className="flex flex-col justify-center">
          <span className=" flex flex-row justify-center">
            <p className={toasts[0]?.category}>{toasts[0]?.message}</p>
          </span>
        </div>
      ) : isLoading ? (
        <>
          <Loading />
          <span>Verifying ... </span>
        </>
      ) : isVerified ? (
        isSubmitted && isResetted ? (
          redirect("/users/auth")
        ) : (
          <main className="flex flex-row justify-center">
            <fieldset className="p-4 md:mt-5 mt-2">
              <PasswordResetForm
                setIsSubmitted={setIsSubmitted}
                setIsResetted={setIsResetted}
                toasts={toasts}
                fetchedToken={fetchedToken}
                setToasts={setToasts}
              />
            </fieldset>
          </main>
        )
      ) : (
        <div className="flex flex-row justify-center">
          <span
            className={"flex flex-col justify-center " + toasts[0]?.category}
          >
            <a href="/users/auth/forgotPassword">Try Again?</a>
          </span>
        </div>
      )}
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

export default VerifyResetPasswordToken;
