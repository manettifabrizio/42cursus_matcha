import { RequestHandler }            from 'express';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { Account }                   from '../../entity';
import { action as registerConfirm } from '../../use-case/register-confirm/action';


type ResponseBody =
{
	id: Account['id']
};

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	await registerConfirm(validation_svc, database_svc,
	{
		id: req.body.id,
		secret: req.body.secret,
	});

	res.status(204).send();
};
