import type { RequestHandler }       from 'express';
import type { Like }                 from '@/feature/like/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as like }            from '@/feature/like/use-case/create/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Like
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id: string; }, ResponseBody> = async (req, res) =>
{
	const liked = await like(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
		id_user_to: req.params.id,
	});

	return res.status(200).json(liked);
};
