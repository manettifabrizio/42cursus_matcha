import type { RequestHandler }       from 'express';
import type { Like }                 from '@/feature/like/entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as findLikesFrom }   from '@/feature/like/use-case/find-by-from/action';
import { action as findLikesTo }     from '@/feature/like/use-case/find-by-to/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	to: Like['id_user_to'][];
	from: Like['id_user_from'][];
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const likes_from_me = await findLikesFrom(validation_svc, database_svc,
	{
		id_user_from: req.user!.id,
	});

	const likes_to_me = await findLikesTo(validation_svc, database_svc,
	{
		id_user_to: req.user!.id,
	});

	return res.status(200).json(
	{
		to: likes_from_me.map(like => like.id_user_to),
		from: likes_to_me.map(like => like.id_user_from),
	});
};
