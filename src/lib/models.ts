import { UserRole } from "@prisma/client";

export type FlashMessage = {
  message: string;
  category: string;
};

export type User = {
  id: number;
  username: string;
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
