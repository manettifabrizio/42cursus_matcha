import type { RequestHandler } from 'express';
import { service as database_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { query as findBlock } from '@/feature/block/use-case/find/query';
import { query as findUser } from '@/feature/user/use-case/find-by-id-with-position/query';
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
		findBlock(database_svc, {
			id_user_from: Number(req.params.id_user),
			id_user_to: req.user!.id,
		})
		.then((block) => {
			if (block !== null)
				return;
			findUser(database_svc, { id: req.user!.id }).then((user) => {
				if (user === null)
					return;
				socket_svc.io().to(`user-${Number(req.params.id_user)}`)
					.emit('unlike:from', {
						id_user_from: req.user!.id,
						firstname: user.firstname,
						lastname: user.lastname,
					});
			}).catch(() => {});
		})
		.catch((err) => {});
	}

	return res.status(204).send();
};
