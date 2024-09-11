import EmailTemplate from "@/emails/EmailTemplate";
import prisma from "@/db";
import { Results } from "@/lib/models";
import {
  HashPassword,
  generateToken,
  getExpireDate,
  isEmail,
  sendMailWithNodemailer,
} from "@/lib/utils";

/**
 * Get User by Email
 * @param email
 * @returns User | Undefined
 */
export async function getUserByEmail(email?: string) {
  if (email) {
    const data = await prisma.user.findFirst({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        lastName: true,
        role: true,
        sessionId: true,
        verified: true,
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

/**
 * Fetch All User cols with Email or Username
 * @param emailOrUsername
 * @returns
 */
export async function getUserByEmailOrUsername(emailOrUsername?: string) {
  let data = null;
  if (emailOrUsername) {
    const isItEmail = isEmail(emailOrUsername);
    if (isItEmail === null) {
      data = await prisma.user.findFirst({
        where: {
          username: emailOrUsername,
        },
      });
    } else {
      data = await prisma.user.findFirst({
        where: {
          email: emailOrUsername,
        },
      });
    }
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

/**
 * Get User by Username
 * @param username
 * @returns User | undefined
 */
export async function getUserByUsername(username?: string) {
  if (username) {
    const data = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        lastName: true,
        role: true,
        sessionId: true,
        verified: true,
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

/**
 * Insert Reset Pwd Token by Email
 * @param email
 * @returns Token | undefined
 */
export async function insertResetPasswordTokenByEmail(email?: string) {
  let token: string | undefined = undefined;
  if (email) {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        lastName: true,
        role: true,
        sessionId: true,
        verified: true,
        resetPasswordToken: true,
      },
      data: {
        resetPasswordToken: generateToken(),
        resetPasswordTokenExpire: getExpireDate(),
      },
    });
    if (user && user.resetPasswordToken) {
      token = user.resetPasswordToken;
    }
  }
  return { token };
}

/**
 * Insert Verify Token by Email
 * @param email
 * @returns Token | undefined
 */
export async function insertVerifyTokenByEmail(email?: string) {
  let token: string | undefined = undefined;
  if (email) {
    const user = await prisma.user.findFirst({
      where: { email: email, verified: false },
    });
    if (user) {
      const user = await prisma.user.update({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          username: true,
          lastName: true,
          role: true,
          sessionId: true,
          verified: true,
          verifyToken: true,
        },
        data: {
          verifyToken: generateToken(),
          verifyTokenExpire: getExpireDate(1440),
        },
      });
      if (user && user.verifyToken) {
        token = user.verifyToken;
      }
    }
  }
  return { token };
}

/**
 * Insert User
 * @param email
 * @param username
 * @param firstName
 * @param lastName
 * @param dob
 * @param nrcNo
 * @param password
 * @param host
 * @returns user: User + verifyToken | undefined,  message: string AND Send verification to the registered mail
 */
export async function insertUser(
  email?: string,
  username?: string,
  firstName?: string,
  lastName?: string,
  dob?: Date,
  nrcNo?: string,
  password?: string,
  host?: string
) {
  let registeredUser;
  let message: string = "Please fill in all the field.";
  const hashPassword = new HashPassword();
  if (
    email &&
    username &&
    firstName &&
    lastName &&
    dob &&
    nrcNo &&
    password &&
    host
  ) {
    const fmtedDob = new Date(dob);
    // Check if user is already registered with the email
    const isUserExistsWithEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    // Check if user is already registered with the username
    const isUserExistsWithUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    // Check if user is already registered with the NRCNo#
    const isUserExistsWithNrcNo = await prisma.user.findFirst({
      where: {
        nrcNo: nrcNo,
      },
    });
    // Check
    if (
      isUserExistsWithEmail === null &&
      isUserExistsWithUsername === null &&
      isUserExistsWithNrcNo === null
    ) {
      // Check if the user is wheather in the Admin or Student Group
      const isUserAdmin = await prisma.adminGroup.findFirst({
        where: { AND: [{ email: email }, { nrcNo: nrcNo }, { dob: fmtedDob }] },
      });

      const isUserStudent = await prisma.studentGroup.findFirst({
        where: { AND: [{ email: email }, { nrcNo: nrcNo }, { dob: fmtedDob }] },
      });

      if (isUserAdmin !== null || isUserStudent !== null) {
        // Encrypt Password
        const hashedPassword = await hashPassword.hash(password);

        try {
          const user = await prisma.user.create({
            data: {
              email: email,
              username: username,
              firstName: firstName,
              lastName: lastName,
              dob: fmtedDob,
              nrcNo: nrcNo,
              role: isUserAdmin !== null ? "ADMIN" : "USER",
              password: hashedPassword,
              // Generate Verification Token
              verifyToken: generateToken(),
              // Set Verification Expire Time
              verifyTokenExpire: getExpireDate(1440),
            },
            select: {
              id: true,
              email: true,
              username: true,
              lastName: true,
              role: true,
              sessionId: true,
              verified: true,
              verifyToken: true,
            },
          });

          if (user) {
            registeredUser = user;
            message = `Registered successfully as ${registeredUser.username}.`;
            const sentEmailId = await sendMailWithNodemailer(
              user.email,
              "TUM: Verify your email before using further features.",
              EmailTemplate({
                description: "to complete the verification",
                lastName: user.lastName!,
                token: user.verifyToken!,
                host: host!,
                path: "/auth/users/verify/",
                buttonValue: "Verify",
              })
            );
            message = sentEmailId
              ? message + ` And sent the verification link to ${user.email}.`
              : message +
                ` Failed to send the verification link to ${user.email}`;
          } else {
            message = "Failed to register the user.";
          }
        } catch (error) {
          console.error("Error: ", error);
        }
      } else {
        message = "You need to register at the admin group first.";
      }
    } else {
      message =
        isUserExistsWithEmail !== null
          ? Results.ACCOUNT_ALREADY_EXIST_WITH_EMAIL
          : isUserExistsWithUsername !== null
          ? Results.ACCOUNT_ALREADY_EXIST_WITH_USERNAME
          : Results.ACCOUNT_ALREADY_EXIST_WITH_NRCNO;
    }
  }
  return { user: registeredUser, message };
}

/**
 * Get User by Reset Pwd Token
 * @param resetToken
 * @returns User | undefined
 */
export async function getUserByResetPasswordToken(resetToken?: string) {
  if (resetToken) {
    const data = await prisma.user.findFirst({
      where: {
        resetPasswordToken: resetToken,
        resetPasswordTokenExpire: {
          gt: new Date(),
        },
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

/**
 * Get User by Verify Token and Verified
 * @param verifyToken
 * @param verified
 * @returns User | null | undefuned
 */
export async function getUserByVerifyTokenAndVerified(
  verifyToken?: string,
  verified?: boolean
) {
  if (verifyToken && verified !== undefined) {
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: verifyToken,
        verified: verified,
        verifyTokenExpire: {
          gt: new Date(),
        },
      },
    });
    return user;
  }
  return undefined;
}

export async function getUserByVerificationToken(verifyToken?: string) {
  if (verifyToken) {
    const user = await prisma.user.findFirst({
      where: {
        verifyToken: verifyToken,
      },
    });
    return user;
  }
  return undefined;
}

/**
 * Update Verified by token
 * @param verifyToken
 * @returns User | undefined
 */
export async function updateVerifiedByVerifyToken(verifyToken?: string) {
  if (
    verifyToken &&
    (await getUserByVerifyTokenAndVerified(verifyToken, false))
  ) {
    const data = await prisma.user.update({
      select: {
        id: true,
        email: true,
        username: true,
        lastName: true,
        role: true,
        sessionId: true,
        verified: true,
      },
      where: {
        verifyToken: verifyToken,
        verifyTokenExpire: {
          gt: new Date(),
        },
        verified: false,
      },
      data: {
        verified: true,
        verifyTokenExpire: new Date(),
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

/**
 * Update Password by Token
 * @param token
 * @param password
 * @returns User | undefined
 */
export async function updatePasswordByResetPasswordToken(
  token?: string,
  password?: string
) {
  const hashPassword = new HashPassword();
  if (token && password) {
    const hashedPassword = await hashPassword.hash(password);
    const user = await prisma.user.update({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpire: {
          gt: new Date(),
        },
      },
      data: {
        password: hashedPassword,
        resetPasswordTokenExpire: new Date(),
      },
    });
    if (user) {
      return user;
    }
  }
  return undefined;
}

/**
 * Get User by ResetPWD token
 * @param token
 * @returns User | undefined
 */
export async function fetchUserByResetPasswordToken(token?: string) {
  if (token) {
    const data = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpire: {
          gt: new Date(),
        },
      },
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

/**
 * Insert Session by Email
 * @param email
 * @returns sessionId & message
 */
export async function insertSessionIdByEmail(email?: string) {
  let sessionId: string | undefined = undefined;
  let message: string = "Please provide required data to login.";
  if (email) {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        sessionId: generateToken(),
      },
    });
    message = "Incorrect email or password. Please try again.";
    if (user) {
      sessionId = user.sessionId!;
      message = `Logged in successfully as ${user.username}.`;
    }
  }
  return { sessionId, message };
}
