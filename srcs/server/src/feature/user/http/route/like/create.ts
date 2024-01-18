import type { RequestHandler } from 'express';
import { service as validation_svc } from '@/core/validation/service';
import { service as database_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findBlock } from '@/feature/block/use-case/find/query';
import { query as findUser } from '@/feature/user/use-case/find-by-id-with-position/query';
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

	findBlock(database_svc, {
		id_user_from: like.id_user_to,
		id_user_to: req.user!.id,
	}).then((block) => {
		if (block !== null)
			return;
		findUser(database_svc, { id: req.user!.id }).then((user) => {
			if (user === null)
				return;
			socket_svc.io().to(`user-${like.id_user_to}`).emit('like:from', {
				id_user_from: like.id_user_from,
				firstname: user.firstname,
				lastname: user.lastname,
			});
		}).catch(() => {});
	}).catch(() => {});

	return res.status(204).send();
};
