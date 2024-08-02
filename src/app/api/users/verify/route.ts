import { NextRequest } from "next/server";
import { Results, User } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import prisma from "@/db";
import {
  fetchUserByResetPasswordToken,
  getUserByVerificationToken,
  getUserByVerifyTokenAndVerified,
  updateVerifiedByVerifyToken,
} from "@/lib/query/user/query";

export async function POST(request: NextRequest) {
  let message: string = Results.FAIL;
  const response = new Response();
  // Get session Data
  const session = await getSession(request, response);

  // Get data from frontend
  const { token } = await request.json();

  // Get Verified
  const user = await getUserByVerificationToken(token);

  // If user exist with that token
  if (user !== null && user !== undefined) {
    if (user.verified === false && user.verifyTokenExpire! > new Date()) {
      // Get Verified
      const verifiedUser = await updateVerifiedByVerifyToken(token);

      // If user verified successfully
      if (verifiedUser) {
        // Update session data
        if (session.user) {
          session.user = verifiedUser as User;
          await session.save();
        }
        message = Results.SUCCESS;
      }
    } else {
      message = user.verified
        ? "You are already verified."
        : "The token is expired please request a new token.";
    }
  } else {
    message = "Please ask for the new token";
  }
  return createResponse(
    response,
    JSON.stringify({
      message: message,
    }),
    { status: 200 }
  );
}

fetchUserByResetPasswordToken()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
