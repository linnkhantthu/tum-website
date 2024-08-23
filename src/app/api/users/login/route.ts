import { NextRequest } from "next/server";
import { Results } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import {
  getUserByEmailOrUsername,
  insertSessionIdByEmail,
} from "@/lib/query/user/query";
import { HashPassword } from "@/lib/utils";

// {user: User, message: Results}
// Request { email, password }
export async function POST(request: NextRequest) {
  const hashPassword = new HashPassword();
  let message: string = Results.REQUIRED_LOGOUT;
  // Create response
  const response = new Response();
  // Create session
  const session = await getSession(request, response);
  let { user: currentUser } = session;
  if (currentUser === undefined) {
    // Get login data
    const { emailOrUsername, password } = await request.json();
    const user = await getUserByEmailOrUsername(emailOrUsername);

    if (user && hashPassword.decrypt(user.password) === password) {
      const { sessionId } = await insertSessionIdByEmail(user.email);
      if (sessionId) {
        session.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          lastName: user.lastName,
          role: user.role,
          verified: user.verified,
          sessionId: sessionId,
        };
        await session.save();
        currentUser = session.user;

        message = `Logged in successfully as ${currentUser.username}`;
      } else {
        message = "Could not generate a new session. Please contact the admin.";
      }
    } else {
      message = "Username/Email or password is incorrect.";
    }
    return createResponse(
      response,
      JSON.stringify({ user: currentUser, message: message }),
      { status: 200 }
    );
  }
  return createResponse(response, JSON.stringify({ message: message }), {
    status: 403,
  });
}
