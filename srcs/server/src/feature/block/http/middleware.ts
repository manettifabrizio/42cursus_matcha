import type { RequestHandler } from 'express';
import { HttpException } from '@/core/exception';
import { service as database_svc } from '@/core/database/service';
import { query as findBlock } from '../use-case/find/query';

// Function --------------------------------------------------------------------
export const middleware: RequestHandler<{ id_user: string }> = async (
	req,
	res,
	next,
) => {
	const is_blocked = !!(await findBlock(database_svc, {
		id_user_from: req.user!.id,
		id_user_to: Number(req.params.id_user) || -1,
	}));

	if (is_blocked) {
		throw new HttpException('Forbidden', {
			cause: `You have blocked this user.`,
		});
	}

	return next();
};
