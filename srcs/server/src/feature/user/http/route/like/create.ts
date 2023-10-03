import type { RequestHandler }       from 'express';
import { service as validation_svc } from '@/core/validation/service';
import { service as database_svc }   from '@/core/database/service';
import { action as createLike }      from '@/feature/like/use-case/create/action';

// Type ------------------------------------------------------------------------
type RequestParams =
{
	id_user: string;
};

type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (req, res) =>
{
	await createLike(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
		id_user_to: Number(req.params.id_user),
	});

	return res.status(204).send();
};
