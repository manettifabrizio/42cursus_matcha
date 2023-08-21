import * as Config           from '@/Config';
import { MailService }       from '@/core/mail/types';
import { CryptoService }     from '@/core/cryto/types';
import { DatabaseService }   from '@/core/database/types';
import { ValidationService } from '@/core/validation/types';
import { Account }           from '../../entity';
import { query }             from './query';
import { validate }          from './validate';


export type ActionInput =
{
	username: string;
	password: string;
	password_confirm: string;
	email: string;
};

export type ActionOutput =
	Pick<Account, 'id'|'email'|'secret'>
;

export const action = async (
	validation_svc: ValidationService,
	database_svc: DatabaseService,
	crypto_svc: CryptoService,
	mail_svc: MailService,
	dto: ActionInput,
)
	: Promise<ActionOutput> =>
{
	const fields = await validate(validation_svc, dto);
	const account = await query(database_svc, crypto_svc, fields);

	// Todo: Match link with frontend routing
	// Note: Do not use await to avoid blocking
	mail_svc.send(
	{
		from: '"Matcha" <noreply@matcha.org>',
		to: account.email,
		subject: "Registration",
		html: `
			Please, click on the following link to validate your email adress: <br>
			<a href="https://${Config.FRONTEND_HOST}/auth/confirm?id=${account.id}&secret=${account.secret}">
				Confirm my email
			</a>
		`
	}).catch((err) =>
	{
		console.log(`MailService::Send: Failed.`, err);
	});

	return account;
};
