import type { RequestHandler }     from 'express';
import { service as database_svc } from '@/core/database/service';
import { query as createBlock }    from '@/feature/block/use-case/create/query';
import { query as deleteLike }     from '@/feature/like/use-case/delete/query';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id_user: string; }, ResponseBody> = async (req, res) =>
{
	try
	{
		database_svc.startTransaction();

		await createBlock(database_svc,
		{
			id_user_from: req.user!.id,
			id_user_to: Number(req.params.id_user),
		});

		await deleteLike(database_svc,
		{
			id_user_from: req.user!.id,
			id_user_to: Number(req.params.id_user),
		});

		database_svc.commitTransaction();

		return res.status(204).send();
	}
	catch (err: unknown)
	{
		database_svc.cancelTransaction();

		throw err;
	}
	finally
	{
		database_svc.releaseClient();
	}
};
