import EmailTemplate from "@/emails/EmailTemplate";
import prisma from "@/db";
import { Results, User } from "@/lib/models";
import {
  HashPassword,
  generateToken,
  getExpireDate,
  isEmail,
  sendMail,
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
    });
    if (data !== null) {
      return data;
    }
  }
  return undefined;
}

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
 * @returns user: User | undefined,  message: string
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
  let registeredUser: User | undefined = undefined;
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
    const isUserExistsWithEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    const isUserExistsWithUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    const isUserExistsWithNrcNo = await prisma.user.findFirst({
      where: {
        nrcNo: nrcNo,
      },
    });
    if (
      isUserExistsWithEmail === null &&
      isUserExistsWithUsername === null &&
      isUserExistsWithNrcNo === null
    ) {
      const encryptedPassword = hashPassword.encrypt(password);
      const fmtedDob = new Date(dob);
      try {
        const user = await prisma.user.create({
          data: {
            email: email,
            username: username,
            firstName: firstName,
            lastName: lastName,
            dob: fmtedDob,
            nrcNo: nrcNo,
            password: encryptedPassword,
            verifyToken: generateToken(),
            verifyTokenExpire: getExpireDate(1440),
          },
        });

        if (user) {
          registeredUser = user as User;
          message = `Registered successfully as ${registeredUser.username}.`;
          const sentEmailId = await sendMail(
            user.email,
            "Todo: Verify your email",
            EmailTemplate({
              description: "to complete the verification",
              lastName: user.lastName,
              token: user.verifyToken!,
              host: host!,
              path: "/users/verify/",
              buttonValue: "Verify",
            })
          );
          // const sentEmailId = await sendMailWithNodemailer(
          //   user.email,
          //   "Todo: Verify your email",
          //   EmailTemplate({
          //     description: "to complete the verification",
          //     lastName: user.lastName!,
          //     token: user.verifyToken!,
          //     host: host!,
          //     path: "/users/verify/",
          //     buttonValue: "Verify",
          //   })
          // );
          message = sentEmailId
            ? message + ` And sent the verification link to ${user.email}.`
            : message +
              ` Failed to send the verification link to ${user.email}`;
          // return sentEmailId ? (user as User) : undefined;
        } else {
          message = "Failed to register the user.";
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    } else {
      // msg = `User already exist with ${username} or ${email}.`;
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
    const encryptedPassword = hashPassword.encrypt(password);
    const user = await prisma.user.update({
      where: {
        resetPasswordToken: token,
        resetPasswordTokenExpire: {
          gt: new Date(),
        },
      },
      data: {
        password: encryptedPassword,
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
