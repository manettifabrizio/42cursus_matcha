import type { RequestHandler }       from 'express';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as removeTag }       from '@/feature/user-tag/use-case/delete/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id: string; }, ResponseBody> = async (req, res) =>
{
	const removed = await removeTag(validation_svc, database_svc,
	{
		id_user: req.user!.id,
		id_tag: req.params.id,
	});

	return res.status(204).send();
};
