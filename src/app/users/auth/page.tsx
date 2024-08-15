"use client";

import FlashMsg from "@/app/components/FlashMsg";
import LoginForm from "@/app/components/forms/Login";
import RegisterForm from "@/app/components/forms/Register";
import Toast from "@/app/components/Toast";
import { FlashMessage } from "@/lib/models";
import { toastOnDelete } from "@/lib/utils-fe";
import React, { useEffect, useState } from "react";

function AuthPage() {
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [toasts, setToasts] = useState<FlashMessage[]>([]);

  return (
    <>
      <main className="flex flex-row justify-center">
        <fieldset className="p-4 md:mt-5 mt-2">
          {isRegisterForm ? (
            <RegisterForm
              isRegisterForm={isRegisterForm}
              setIsRegisterForm={setIsRegisterForm}
              setToasts={setToasts}
            />
          ) : (
            <LoginForm
              isRegisterForm={isRegisterForm}
              setIsRegisterForm={setIsRegisterForm}
              setToasts={setToasts}
            />
          )}
        </fieldset>
      </main>
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

export default AuthPage;
