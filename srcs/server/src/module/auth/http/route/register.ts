import { RequestHandler }            from 'express';
import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as mail_svc }       from '@/core/mail/service';
import { service as validation_svc } from '@/core/validation/service';
import { Account }                   from '../../entity';
import { action as register }        from '../../use-case/register/action';


type ResponseBody =
{
	id: Account['id'];
};

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const account = await register(validation_svc, database_svc, crypto_svc, mail_svc,
	{
		username: req.body.username,
		password: req.body.password,
		password_confirm: req.body.password_confirm,
		email: req.body.email,
	});

	res.status(200).json({
		id: account.id,
	});
};
