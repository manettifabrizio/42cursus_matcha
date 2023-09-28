import type { RequestHandler }       from 'express';
import type { Report }               from '@/feature/report/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as report }          from '@/feature/report/use-case/create/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Report
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id: string; }, ResponseBody> = async (req, res) =>
{
	const reported = await report(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
		id_user_to: req.params.id,
	});

	return res.status(200).json(reported);
};
