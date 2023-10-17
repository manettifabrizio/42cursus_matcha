import type { RequestHandler } from 'express';
import { HttpException } from '@/core/exception';
import { service as database_svc } from '@/core/database/service';
import { query as findUserByIdWithPosition } from '../use-case/find-by-id-with-position/query';

// Function --------------------------------------------------------------------
export const middleware: RequestHandler<{ id_user?: string }> = async (
	req,
	res,
	next,
) => {
	const hasCompletedProfile = (user: object) =>
		Object.values(user).filter((value) => value === null).length === 0;
	const me = await findUserByIdWithPosition(database_svc, {
		id: req.user!.id,
	});

	if (me === null || hasCompletedProfile(me) === false) {
		throw new HttpException('Forbidden', {
			cause: `You have to complete your profile.`,
		});
	}

	if (req.params.id_user) {
		const target = await findUserByIdWithPosition(database_svc, {
			id: Number(req.params.id_user) || -1,
		});

		if (target === null || hasCompletedProfile(target) === false) {
			throw new HttpException('Not Found', {
				cause: `User does not exist.`,
			});
		}
	}

	return next();
};
