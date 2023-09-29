import type { RequestHandler }       from 'express';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { NotFoundException }         from '@/feature/error/exception';
import { ForbiddenException }        from '@/feature/error/exception';
import { action as find }            from '../use-case/find-by-id/action';

// Function --------------------------------------------------------------------
export const middleware : RequestHandler =  async (req, res, next) =>
{
	if (req.params.id)
	{
		const hasCompletedProfile = (user: object) =>
			Object.values(user)
			.map((value) => value === null)
			.some(is_uncomplete => is_uncomplete)
		;

		const user = await find(validation_svc, database_svc,
		{
			id: req.user!.id,
		});

		if (user === null || !hasCompletedProfile(user))
		{
			throw new ForbiddenException(`You have to complete your profile to perform this action.`);
		}

		const target = await find(validation_svc, database_svc,
		{
			id: req.params.id,
		});

		if (target === null || !hasCompletedProfile(target))
		{
			throw new NotFoundException(`User does not exist.`);
		}
	}

	return next();
};
