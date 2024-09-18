import React, { FormEvent, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import Btn from "./Btn";
import Input from "./Input";
import { FlashMessage, User } from "@/lib/models";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";
import { makeid } from "@/lib/utils-fe";
import { passwordValidator } from "@/lib/validators";

function LoginForm({
  isRegisterForm,
  setIsRegisterForm,
  setToasts,
}: {
  isRegisterForm: boolean;
  setIsRegisterForm: React.Dispatch<React.SetStateAction<boolean>>;
  setToasts: React.Dispatch<React.SetStateAction<FlashMessage[]>>;
}) {
  const { data, mutateUser } = useUser();
  const { push } = useRouter();
  const [emailOrUsername, emailOrUsernameController] = useState("");
  const [password, passwordController] = useState("");

  const [emailOrUsernameError, emailOrUsernameErrorController] =
    useState<string>();
  const [passwordError, passwordErrorController] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    emailOrUsernameErrorController(undefined);
    passwordErrorController(undefined);
    if (passwordValidator(password, passwordErrorController)) {
      const formData = {
        emailOrUsername: emailOrUsername,
        password: password,
      };
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const { user, message }: { user: User; message: string } =
          await res.json();
        if (user) {
          // Logged in successfully
          const toasts: FlashMessage = {
            id: makeid(10),
            message: message,
            category: "alert-success",
          };

          localStorage.setItem("toasts", JSON.stringify([toasts]));
          await mutateUser({ ...data, user: user });
          push("/");
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
            message: `Connection error, status code is ${res.status}`,
            category: "bg-info",
          },
        ]);
      }
    }
    setIsSubmitting(false);
  };
  return (
    <>
      <legend>
        <h2>Login</h2>
      </legend>
      <form
        onSubmit={submitForm}
        className="grid grid-flow-row md:grid-cols-2 grid-cols-1"
      >
        <Input
          label={"Email or Username"}
          type={"text"}
          id={"email_or_username"}
          Icon={FaUserCircle}
          value={emailOrUsername}
          controller={emailOrUsernameController}
          error={emailOrUsernameError}
          errorController={emailOrUsernameErrorController}
        />
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
        <span className="flex flex-row pt-3">
          <input
            className="checkbox checkbox-info"
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
          />{" "}
          <span className="pl-3 pb-3">Remember Me</span>
        </span>
        <span></span>
        <a href="/users/auth/forgotPassword" className="link">
          Forgot Password?
        </a>
        <span></span>
        <Btn text={"Login"} isSubmitting={isSubmitting} />
        <span></span>
        <span
          className="link "
          onClick={() => {
            setIsRegisterForm(!isRegisterForm);
          }}
        >
          Need an account?
        </span>
      </form>
    </>
  );
}

export default LoginForm;
