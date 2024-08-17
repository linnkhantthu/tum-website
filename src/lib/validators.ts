import { usernameFormat } from "./models";

export function isEmail(email: string) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

/**
 * Email Validator
 * @param value
 * @param errorController
 * @returns
 */
export const emailValidator = (
  value: string,
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  let status = true;
  let message = undefined;
  if (isEmail(value) === null) {
    status = false;
    message = "Please fill in the valid mail to continue";
    errorController(message);
    return status;
  }
  errorController(undefined);
  return status;
};

/**
 * Username Validator
 * @param value
 * @param errorController
 * @returns
 */
export const usernameValidator = (
  value: string,
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  let status = true;
  let message = undefined;
  if (usernameFormat.test(value)) {
    status = false;
    message = "Username cannot contain special characters.";
    errorController(message);
    return status;
  }
  errorController(undefined);
  return status;
};

/**
 * DOB Validator
 * @param value
 * @param errorController
 * @returns
 */
export const dobValidator = (
  value: string,
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  let status = true;
  let message = undefined;
  const dob = new Date(value);
  const now = new Date();
  now.setFullYear(now.getFullYear() - 12);
  if (dob > now) {
    status = false;
    message = "You have to be over 12 years old to register.";
    errorController(message);
    return status;
  }
  errorController(undefined);
  return status;
};

/**
 * NRCNo# Validator
 * @param value
 * @param errorController
 * @returns
 */
export const nrcNoValidator = (
  value: string,
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const nrcFormat =
    /^([0-9]{1,2})\/([A-Z][a-z]|[A-Z][a-z][a-z])([A-Z][a-z]|[A-Z][a-z][a-z])([A-Z][a-z]|[A-Z][a-z][a-z])\([NPE]\)[0-9]{6}$/;
  let status = true;
  let message = undefined;
  // 0/AAA(N)000000
  if (!nrcFormat.test(value)) {
    status = false;
    message = "Invalid NRC Format.";
    errorController(message);
    return status;
  }
  errorController(undefined);
  return status;
};

/**
 * Password Validator
 * @param value
 * @param errorController
 * @returns
 */
export const passwordValidator = (
  value: string,
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  let status = true;
  let message = undefined;
  if (value.length < 8) {
    status = false;
    message = "Password must be at least have 8 characters.";
    errorController(message);
    return status;
  }
  errorController(undefined);
  return status;
};

/**
 * Confirm Password Validator
 * @param password
 * @param confirmPassword
 * @param errorController
 * @returns
 */
export const confirmPasswordValidator = (
  password: string,
  confirmPassword: string,
  errorController: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  let status = true;
  let message = undefined;
  if (confirmPassword !== password) {
    status = false;
    message = "This field must be the same with the Password one.";
    errorController(message);
    return status;
  }
  errorController(undefined);
  return status;
};
