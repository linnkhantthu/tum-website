import { NextRequest } from "next/server";
import { Results } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import { fetchUserByResetPasswordToken } from "@/lib/query/user/query";

export async function POST(request: NextRequest) {
  let message: string = Results.REQUIRED_LOGOUT;
  let dbToken: string | undefined = undefined;
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  const { user: currentUser } = session;
  if (currentUser === undefined) {
    message = "Token expired or invalid token.";
    // Get login data
    const { token } = await request.json();

    const user = await fetchUserByResetPasswordToken(token);
    if (user && user.resetPasswordToken) {
      dbToken = token;
      message = "Checked token successfully.";
    }
    return createResponse(
      response,
      JSON.stringify({
        token: dbToken,
        message: message,
      }),
      { status: 200 }
    );
  }
  return createResponse(response, JSON.stringify({ message: message }), {
    status: 403,
  });
}
