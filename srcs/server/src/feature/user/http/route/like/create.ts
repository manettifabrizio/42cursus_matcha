import type { RequestHandler } from 'express';
import { service as validation_svc } from '@/core/validation/service';
import { service as database_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { action as createLike } from '@/feature/like/use-case/create/action';

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
	const like = await createLike(validation_svc, database_svc, {
		id_user_from: req.user!.id,
		id_user_to: Number(req.params.id_user) || -1,
	});

	socket_svc.io().to(`user-${like.id_user_to}`).emit('like:from', like);

	return res.status(204).send();
};
