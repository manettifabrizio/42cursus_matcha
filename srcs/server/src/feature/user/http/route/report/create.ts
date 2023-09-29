import type { RequestHandler }       from 'express';
import type { Report }               from '@/feature/report/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as report }          from '@/feature/report/use-case/create/action';
import { action as unlike }          from '@/feature/like/use-case/delete/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id: string; }, ResponseBody> = async (req, res) =>
{
	try
	{
		database_svc.startTransaction();

		const blocked = await report(validation_svc, database_svc,
		{
			id_user_from: req.user!.id,
			id_user_to: req.params.id,
		});

		const unliked = await unlike(validation_svc, database_svc,
		{
			id_user_from: req.user!.id,
			id_user_to: req.params.id,
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
