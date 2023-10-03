import { createTransport } from "nodemailer";

// Type ------------------------------------------------------------------------
export interface MailService {
  send: ReturnType<typeof createTransport>["sendMail"];
}
