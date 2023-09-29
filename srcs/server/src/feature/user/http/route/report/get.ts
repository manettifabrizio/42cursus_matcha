import type { RequestHandler }       from 'express';
import type { Report }               from '@/feature/report/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as findReportsFrom } from '@/feature/report/use-case/find-by-from/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	reports: Report['id_user_to'][];
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const likes_from_me = await findReportsFrom(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
	});

	return res.status(200).json(
	{
		reports: likes_from_me.map(like => like.id_user_to),
	});
};
