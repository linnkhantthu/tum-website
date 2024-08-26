"use client";
import { FlashMessage, Results, responseModel } from "@/lib/models";
import useUser from "@/lib/useUser";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import Loading from "../../../components/Loading";
import ForgotPasswordForm from "@/app/components/forms/ForgotPasswordForm";
import { makeid } from "@/lib/utils-fe";

function ForgotPassword() {
  const { data, isError, isLoading } = useUser();

  return (
    <>
      {isError ? (
        <span>{Results.CONNECTION_ERROR}</span>
      ) : isLoading ? (
        <Loading />
      ) : data.user === undefined ? (
        <main className="flex flex-row justify-center">
          <fieldset className="p-4 md:mt-5 mt-2">
            <ForgotPasswordForm />
          </fieldset>
        </main>
      ) : (
        redirect("/")
      )}
    </>
  );
}

export default ForgotPassword;
