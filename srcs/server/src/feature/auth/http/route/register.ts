import type { RequestHandler } from "express";
import type { Account } from "../../entity";
import * as Config from "@/Config";
import { service as crypto_svc } from "@/core/cryto/service";
import { service as database_svc } from "@/core/database/service";
import { service as mail_svc } from "@/core/mail/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as createUser } from "@/feature/user/use-case/create/action";
import { action as createAccount } from "../../use-case/create/action";

// Type ------------------------------------------------------------------------
type RequestBody = {
  username: string;
  password: string;
  password_confirm: string;
  email: string;
  firstname: string;
  lastname: string;
};

type ResponseBody = Pick<Account, "id" | "email">;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody, RequestBody> = async (
  req,
  res
) => {
  try {
    database_svc.startTransaction();

    const account = await createAccount(
      validation_svc,
      database_svc,
      crypto_svc,
      {
        username: req.body.username,
        password: req.body.password,
        password_confirm: req.body.password_confirm,
        email: req.body.email,
      }
    );

    const user = await createUser(validation_svc, database_svc, {
      id: account.id,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    database_svc.commitTransaction();

    // Todo: Match link with frontend routing
    // Note: Do not use await to avoid blocking
    mail_svc
      .send({
        from: '"Matcha" <noreply@matcha.org>',
        to: account.email,
        subject: "Registration",
        html: `
				Please, click on the following link to validate your email adress: <br>
				<a href="https://${Config.FRONTEND_HOST}/auth/confirm?id=${account.id}&secret=${account.secret}">
					Confirm my email
				</a>
			`,
      })
      .catch((err) => {
        // console.log(`MailService::Send: Failed.`, err);
      });

    return res.status(200).json({
      id: account.id,
      email: account.email,
    });
  } catch (err: unknown) {
    database_svc.cancelTransaction();

    throw err;
  } finally {
    database_svc.releaseClient();
  }
};
