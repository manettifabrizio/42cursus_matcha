import * as Config           from '@/Config';
import { CryptoService }     from '@/core/cryto/types';
import { DatabaseService }   from '@/core/database/types';
import { MailService }       from '@/core/mail/types';
import { ValidationService } from '@/core/validation/types';
import { Account }           from '../../entity';
import { AuthException }     from '../../exception';
import { query }             from './query';
import { validate }          from './validate';


type ActionInput =
{
	id: number;
	email: string;
};

type ActionOutput =
	Pick<Account, 'id'|'email'>
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

	if (account === null)
	{
		throw new AuthException({
			cause: `Invalid credentials.`
		});
	}

	// Todo: Match link with frontend routing
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

	return {
		id: account.id,
		email: account.email,
	};
};
