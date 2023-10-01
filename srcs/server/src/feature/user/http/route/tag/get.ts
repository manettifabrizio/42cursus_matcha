import type { RequestHandler }       from 'express';
import type { Tag }                  from '@/feature/tag/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as findTagsByUser }  from '@/feature/user-tag/use-case/find-by-user/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Tag[]
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id?: string; }, ResponseBody> = async (req, res) =>
{
	const tags = await findTagsByUser(validation_svc, database_svc,
	{
		id_user: req.params.id ?? req.user!.id,
	});

	return res.status(200).json(tags);
};
