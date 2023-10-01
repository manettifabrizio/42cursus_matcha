import type { RequestHandler }     from 'express';
import { service as database_svc } from '@/core/database/service';
import { ForbiddenException }      from '@/feature/error/exception';
import { query as findReport }     from '../use-case/find/query';

// Function --------------------------------------------------------------------
export const middleware : RequestHandler<{ id_user: string}> =  async (req, res, next) =>
{
	const is_reported = !!(await findReport(database_svc,
	{
		id_user_from: req.user!.id,
		id_user_to: Number(req.params.id_user),
	}));

	if (is_reported)
	{
		throw new ForbiddenException(`You have reported this user.`);
	}

	return next();
};
