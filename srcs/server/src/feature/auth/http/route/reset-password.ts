import type { RequestHandler } from "express";
import * as Config from "@/Config";
import { HttpException } from "@/core/exception";
import { service as mail_svc } from "@/core/mail/service";
import { service as crypto_svc } from "@/core/cryto/service";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as resetPassword } from "../../use-case/reset-password/action";

// Type ------------------------------------------------------------------------
type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
  const account = await resetPassword(
    validation_svc,
    database_svc,
    crypto_svc,
    {
      username: req.body.username,
      email: req.body.email,
    }
  );

  if (account === null) {
    throw new HttpException("Unauthorized", {
      cause: `Invalid credentials.`,
    });
  }

  if (account.is_confirmed === false) {
    throw new HttpException("Forbidden", {
      cause: `Account email hasn't been confirmed.`,
    });
  }

  // Todo: Match link with frontend routing
  // Note: Do not use await to avoid blocking
  mail_svc
    .send({
      from: '"Matcha" <noreply@matcha.org>',
      to: account.email,
      subject: "Reset Password",
      html: `
			Please, click on the following link to update your password: <br>
			<a href="https://${Config.FRONTEND_HOST}/auth/new-password?id=${account.id}&secret=${account.secret}">
				Update my password
			</a>
		`,
    })
    .catch((err) => {
      // console.log(`MailService::Send: Failed.`, err);
    });

  return res.status(204).send();
};
