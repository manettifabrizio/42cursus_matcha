import { RequestHandler }            from 'express';
import { service as mail_svc }       from '@/core/mail/service';
import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { Account }                   from '../../entity';
import { action as editEmail }       from '../../use-case/edit-email/action';


type ResponseBody =
{
	email: Account['email'];

};

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	await editEmail(validation_svc, database_svc, crypto_svc, mail_svc,
	{
		id: req.user!.id,
		email: req.body.email,
	});

	res.status(204).send();
};
