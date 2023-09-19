import type { RequestHandler }       from 'express';
import type { Account }              from '@/feature/auth/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as confirm }         from '@/feature/auth/use-case/confirm/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	id: Account['id']
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const account = await confirm(validation_svc, database_svc,
	{
		id: req.body.id,
		secret: req.body.secret,
	});

	return res.status(204).send();
};
