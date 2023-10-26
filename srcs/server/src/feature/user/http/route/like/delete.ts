import type { RequestHandler } from 'express';
import { service as database_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as deleteLike } from '@/feature/like/use-case/delete/query';

// Type ------------------------------------------------------------------------
type RequestParams = {
	id_user: string;
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (
	req,
	res,
) => {
	const deleted = await deleteLike(database_svc, {
		id_user_from: req.user!.id,
		id_user_to: Number(req.params.id_user) || -1,
	});

	if (deleted) {
		socket_svc
			.io()
			.to(`user-${Number(req.params.id_user)}`)
			.emit('unlike:from', { from: Number(req.params.id_user) });
	}

	return res.status(204).send();
};
