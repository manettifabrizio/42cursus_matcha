import type { RequestHandler } from "express";
import * as Config from "@/Config";
import { service as database_svc } from "@/core/database/service";
import { service as crypto_svc } from "@/core/cryto/service";
import { service as mail_svc } from "@/core/mail/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as findAccountByCrendentials } from "../../use-case/find-by-credentials/action";
import { query as findAccountById } from "../../use-case/find-by-id/query";
import { HttpException } from '@/core/exception';
import { middleware as AuthMiddleware } from '../middleware';

// Type ------------------------------------------------------------------------
type RequestBody = {
	username: string
	password: string
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody, RequestBody> = async (
  req,
  res
) => {
	let account = null;
	
	if (req.body.username && req.body.password) {
		account = await findAccountByCrendentials(validation_svc, database_svc, crypto_svc, {
			username: req.body.username,
			password: req.body.password,
		});
	}
	else {
		AuthMiddleware(req, res, () => {});

		if (req.user?.id) {
			account = await findAccountById(database_svc, { id: req.user.id });
		}
	}

	
	if (account === null) {
		throw new HttpException("Unauthorized", {
			cause: `Invalid credentials.`
		});
	}

	if (account.is_confirmed && (!account.email_new || account.email === account.email_new))
	{
		throw new HttpException("Forbidden", {
			cause: `Email has already been validated.`
		});
	}

	// Todo: Match link with frontend routing
	try {
		await mail_svc.send({
			from: '"Matcha" <noreply@matcha.org>',
			to: account.email_new ?? account.email,
			subject: "Email Confirmation",
			html: `
				Please, click on the following link to validate your email adress: <br>
				<a href="https://${Config.FRONTEND_HOST}/auth/confirm?id=${account.id}&secret=${account.secret}">
					Confirm my email
				</a>
			`,
		});
	}
	catch (err: any) {
		throw new HttpException("Failed Dependency", {
			cause: `Failed to send confirmation email.`,
			details: err,
		});
	}

    return res.status(201).json();
};
