import { NextRequest } from "next/server";
import { Messages } from "@/lib/models";
import { createResponse } from "@/lib/session";
import EmailTemplate from "@/emails/EmailTemplate";
import { insertVerifyTokenByEmail } from "@/lib/query/user/query";
import { isAuth, sendMailWithNodemailer } from "@/lib/utils";

// {email: string, message: Results}
// { email: string }
export async function POST(request: NextRequest) {
  // Declare Var
  let message: string = Messages.REQUIRED_LOGIN;
  let isSuccess = false;

  // Create response
  const response = new Response();

  // Create session and get User
  const { isLoggedIn, currentUser } = await isAuth(request, response);

  // If the user is loggedout
  if (isLoggedIn && currentUser) {
    const { token } = await insertVerifyTokenByEmail(currentUser.email);
    if (token) {
      try {
        const sentEmailId = await sendMailWithNodemailer(
          currentUser.email,
          "TUM: Verify your email",
          EmailTemplate({
            description: "to complete verification",
            lastName: currentUser.lastName,
            token: token,
            host: request.headers.get("host")!,
            path: "/users/auth/verify/",
            buttonValue: "Verify",
          })
        );

        if (sentEmailId !== null) {
          isSuccess = true;
          message =
            "We have sent a verification token to " +
            currentUser.email +
            "successfully";
        }
      } catch (error: any) {
        console.log(error);
        isSuccess = false;
        message = "Failed to send an email to " + currentUser.email + ".";
      }
    }
    return createResponse(
      response,
      JSON.stringify({
        data: { email: currentUser.email },
        isSuccess: isSuccess,
        message: message,
      }),
      { status: 200 }
    );
  }
  return createResponse(
    response,
    JSON.stringify({ isSuccess: isSuccess, message: Messages.INVALID_REQUEST }),
    {
      status: 403,
    }
  );
}
