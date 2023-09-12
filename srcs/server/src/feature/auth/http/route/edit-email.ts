import type { RequestHandler }       from 'express';
import type { Account }              from '@/feature/auth/entity';
import * as Config                   from '@/Config';
import { service as mail_svc }       from '@/core/mail/service';
import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as editEmail }       from '@/feature/auth/use-case/edit-email/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	email: Account['email'];

};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const account = await editEmail(validation_svc, database_svc, crypto_svc,
	{
		id: req.user!.id,
		email: req.body.email,
	});

	// Todo: Match link with frontend routing
	// Note: Do not use await to avoid blocking
	mail_svc.send(
	{
		from: '"Matcha" <noreply@matcha.org>',
		to: account.email,
		subject: "Email Update",
		html: `
			Please, click on the following link to validate your new email adress: <br>
			<a href="https://${Config.FRONTEND_HOST}/auth/confirm?id=${account.id}&secret=${account.secret}">
				Confirm my email
			</a>
		`
	}).catch((err) =>
	{
		console.log(`MailService::Send: Failed.`, err);
	});

	return res.status(204).send();
};
