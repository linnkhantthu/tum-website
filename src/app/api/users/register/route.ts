import { NextRequest } from "next/server";
import { Results, User } from "@/lib/models";
import { createResponse, getSession } from "@/lib/session";
import prisma from "@/db";
import { insertUser } from "@/lib/query/user/query";
import { isAuth } from "@/lib/utils";

export async function POST(request: NextRequest) {
  // Create response
  const response = new Response();
  // Create session
  const { currentUser } = await isAuth(request, response);

  if (currentUser === undefined) {
    const { email, username, firstName, lastName, dob, nrcNo, password } =
      await request.json();
    const { user, message } = await insertUser(
      email,
      username,
      firstName,
      lastName,
      dob,
      nrcNo,
      password,
      request.headers.get("host")!
    );
    return createResponse(
      response,
      JSON.stringify({
        user: user,
        message: message,
      }),
      { status: 200 }
    );
  } else {
    return createResponse(
      response,
      JSON.stringify({
        user: undefined,
        message: Results.REQUIRED_LOGOUT,
      }),
      { status: 403 }
    );
  }
}

insertUser()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
