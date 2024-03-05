import type { RequestHandler } from "express";
import type { Account } from "../../entity";
import * as Config from "@/Config";
import { service as mail_svc } from "@/core/mail/service";
import { service as crypto_svc } from "@/core/cryto/service";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as edit } from "../../use-case/edit/action";

// Type ------------------------------------------------------------------------
type RequestBody = {
  email: string;
  password: string;
  password_confirm: string;
};

type ResponseBody = Pick<Account, "email"> | void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody, RequestBody> = async (
  req,
  res
) => {
  const account = await edit(validation_svc, database_svc, crypto_svc, {
    id: req.user!.id,
    email: req.body.email,
    password: req.body.password,
    password_confirm: req.body.password_confirm,
  });

  if (!account?.email) {
    return res.status(204).send();
  }

  // Todo: Match link with frontend routing
  // Note: Do not use await to avoid blocking
  mail_svc
    .send({
      from: '"Matcha" <noreply@matcha.org>',
      to: account.email,
      subject: "Email Update",
      html: `
			Please, click on the following link to validate your new email adress: <br>
			<a href="https://${Config.FRONTEND_HOST}/auth/confirm?id=${account.id}&secret=${account.secret}">
				Confirm my email
			</a>
		`,
    })
    .catch((err) => {
      // console.log(`MailService::Send: Failed.`, err);
    });

  return res.status(200).json({ email: account.email });
};
