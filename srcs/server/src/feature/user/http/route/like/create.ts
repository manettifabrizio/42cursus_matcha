import type { RequestHandler }     from 'express';
import { service as database_svc } from '@/core/database/service';
import { query as createLike }     from '@/feature/like/use-case/create/query';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id_user: string; }, ResponseBody> = async (req, res) =>
{
	await createLike(database_svc,
	{
		id_user_from: req.user!.id,
		id_user_to: Number(req.params.id_user),
	});

	return res.status(204).send();
};
