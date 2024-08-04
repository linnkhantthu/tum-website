import { OutputData } from "@editorjs/editorjs";
import { UserRole } from "@prisma/client";

export type FlashMessage = {
  message: string;
  category: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  lastName: string;
  role: UserRole;
  sessionId: string;
  verified: boolean;
};
/**
 * Response Model from Api
 */
export interface responseModel {
  data?: any;
  isSuccess: boolean;
  message: string;
}

export type Article = {
  id: number;
  date: Date;
  content: OutputData;
  userId: number;
  author: User;
};

/**
 * Results
 */
export enum Results {
  REQUIRED_LOGIN = "You need to login to perform this action",
  REQUIRED_LOGOUT = "You need to logged out in order to perform this action",
  SUCCESS = "Operation succeed",
  FAIL = "Operation failed",
  SERVER_ERROR = "Server error",
  CONNECTION_ERROR = "Connection error occcured",
  AUTH_ERROR = "Username or password is incorrect",
  ACCOUNT_ALREADY_EXIST_WITH_USERNAME = "Account already exist with this username.",
  ACCOUNT_ALREADY_EXIST_WITH_EMAIL = "Account already exist with this email.",
}

/**
 * Messages
 */
export enum Messages {
  REQUIRED_LOGIN = "You need to login to perform this action",
  REQUIRED_LOGOUT = "You need to logged out in order to perform this action",
  INVALID_REQUEST = "Unauthorised Request",
}
