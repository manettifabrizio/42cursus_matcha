import type { RequestHandler }       from 'express';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { ForbiddenException }        from '@/feature/error/exception';
import { action as find }            from '../use-case/find/action';

// Function --------------------------------------------------------------------
export const middleware : RequestHandler =  async (req, res, next) =>
{
	const is_blocked = await find(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
		id_user_to: req.params.id,
	});

	if (is_blocked !== null)
	{
		throw new ForbiddenException(`You have blocked this user.`);
	}

	return next();
};
