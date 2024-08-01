"use client";

import FlashMsg from "@/app/components/FlashMsg";
import LoginForm from "@/app/components/forms/Login";
import RegisterForm from "@/app/components/forms/Register";
import { FlashMessage } from "@/lib/models";
import React, { useState } from "react";

function AuthPage() {
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [flashMessage, setFlashMessage] = useState<FlashMessage | undefined>();

  return (
    <main className="flex flex-row justify-center">
      <fieldset className="p-4 md:mt-5 mt-2">
        {flashMessage ? <FlashMsg flashMessage={flashMessage} /> : ""}
        {isRegisterForm ? (
          <RegisterForm
            isRegisterForm={isRegisterForm}
            setIsRegisterForm={setIsRegisterForm}
          />
        ) : (
          <LoginForm
            isRegisterForm={isRegisterForm}
            setIsRegisterForm={setIsRegisterForm}
          />
        )}
      </fieldset>
    </main>
  );
}

export default AuthPage;
