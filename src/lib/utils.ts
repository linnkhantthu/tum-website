import crypto from "crypto";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { getSession } from "./session";
import { getUserByUsername } from "./query/user/query";
import { Auth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export function generateToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

export function getExpireDate(mins?: number): Date {
  let now = new Date();
  now.setMinutes(now.getMinutes() + (mins ? mins : 15));
  return now;
}

export function getDateNow(): Date {
  const now = new Date();
  return now;
}

export class HashPassword {
  private readonly ENC: Buffer;
  private readonly IV: string;
  private readonly ALGO: string;

  constructor() {
    this.IV = process.env.IV!;
    this.ALGO = process.env.ALGO!;
    const secret = process.env.SECRET_KEY!;
    const key = crypto
      .createHash("sha256")
      .update(String(secret))
      .digest("base64");
    this.ENC = Buffer.from(key, "base64");
  }

  encrypt(text: string) {
    let cipher = crypto.createCipheriv(this.ALGO, this.ENC, this.IV);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  decrypt = (text: string) => {
    let decipher = crypto.createDecipheriv(this.ALGO, this.ENC, this.IV);
    let decrypted = decipher.update(text, "base64", "utf8");
    return decrypted + decipher.final("utf8");
  };
}

export async function sendMail(
  email: string,
  subject: string,
  template: JSX.Element
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const data = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    // to: [email],
    to: "delivered@resend.dev",
    subject: subject,
    react: template,
  });
  return data.data;
}

/**
 * Send Mail with Nodemailer
 * @param email
 * @param subject
 * @param template
 * @returns
 */
export async function sendMailWithNodemailer(
  email: string,
  subject: string,
  template: JSX.Element
): Promise<string> {
  const ReactDOMServer = (await import("react-dom/server")).default;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: "linn@dimensions.com",
    to: email,
    subject: subject,
    html: ReactDOMServer.renderToString(template),
  });
  return info.messageId;
}

export async function isAuth(request: Request, response: Response) {
  const session = await getSession(request, response);
  const { user } = session;
  if (user) {
    const dbUser = await getUserByUsername(user.username);
    if (dbUser && user.sessionId === dbUser.sessionId) {
      session.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
        sessionId: user.sessionId,
      };
      await session.save();
      return { isLoggedIn: true, currentUser: user };
    }
  }
  await session.destroy();
  return { isLoggedIn: false };
}

export function isEmail(email: string) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

export async function signInFirebase(auth: Auth) {
  console.log(process.env.MAIL_ADDRESS);
  console.log(process.env.USER_PASSWORD);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      process.env.MAIL_ADDRESS!,
      process.env.USER_PASSWORD!
    );
    return userCredential.user.uid;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function signOutFirebase(auth: Auth) {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
