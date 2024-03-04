import type { RequestHandler } from 'express';
import { service as database_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as createBlock } from '@/feature/block/use-case/create/action';
import { query as deleteLike } from '@/feature/like/use-case/delete/query';
import { query as findUserByIdWithPosition } from '@/feature/user/use-case/find-by-id-with-position/query';

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
	try {
		database_svc.startTransaction();

		await createBlock(validation_svc, database_svc, {
			id_user_from: req.user!.id,
			id_user_to: Number(req.params.id_user) || -1,
		});

		const removed = await deleteLike(database_svc, {
			id_user_from: req.user!.id,
			id_user_to: Number(req.params.id_user) || -1,
		});

		if ( removed )
		{
			const user = await findUserByIdWithPosition(database_svc, {
				id: req.user!.id,
			});

			if ( user )
			{
				socket_svc.io()
					.to(`user-${Number(req.params.id_user)}`)
					.emit('unlike:from', {
						id_user_from: req.user!.id,
						firstname: user.firstname,
						lastname: user.lastname,
					});
			}
		}

		database_svc.commitTransaction();

		return res.status(204).send();
	} catch (err: unknown) {
		database_svc.cancelTransaction();

		throw err;
	} finally {
		database_svc.releaseClient();
	}
};
