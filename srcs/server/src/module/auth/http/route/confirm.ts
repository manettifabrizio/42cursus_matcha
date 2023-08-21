import { RequestHandler }            from 'express';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { Account }                   from '@/module/auth/entity';
import { action as confirm }         from '@/module/auth/use-case/confirm/action';


type ResponseBody =
{
	id: Account['id']
};

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const account = await confirm(validation_svc, database_svc,
	{
		id: req.body.id,
		secret: req.body.secret,
	});

	return res.status(204).send();
};
