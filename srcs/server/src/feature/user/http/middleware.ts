import type { RequestHandler }               from 'express';
import { service as database_svc }           from '@/core/database/service';
import { NotFoundException }                 from '@/feature/error/exception';
import { ForbiddenException }                from '@/feature/error/exception';
import { query as findUserByIdWithPosition } from '../use-case/find-by-id-with-position/query';

// Function --------------------------------------------------------------------
export const middleware : RequestHandler<{ id_user?: string }> =  async (req, res, next) =>
{
	const hasCompletedProfile = (user: object) =>
		Object.values(user).filter((value) => value === null).length === 0
	;

	const me = await findUserByIdWithPosition(database_svc,
	{
		id: req.user!.id,
	});

	if (me === null || hasCompletedProfile(me) === false)
	{
		throw new ForbiddenException(`You have to complete your profile.`);
	}

	if (req.params.id_user)
	{
		const target = await findUserByIdWithPosition(database_svc,
		{
			id: Number(req.params.id_user),
		});

		if (target === null || hasCompletedProfile(target) === false)
		{
			throw new NotFoundException(`User does not exist.`);
		}
	}

	return next();
};
