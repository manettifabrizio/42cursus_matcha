import type { RequestHandler }          from 'express';
import type { User }                    from '@/feature/user/entity';
import type { Like }                    from '@/feature/like/entity';
import { service as database_svc }      from '@/core/database/service';
import { query as findLikesByUserFrom } from '@/feature/like/use-case/find-by-user-from/query';
import { query as findLikesByUserTo }   from '@/feature/like/use-case/find-by-user-to/query';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	likes: {
		by_me: (Pick<User, 'id'> & Pick<Like, 'created_at'>)[];
		to_me: (Pick<User, 'id'> & Pick<Like, 'created_at'>)[];
	};
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const liked_users = await findLikesByUserFrom(database_svc,
	{
		id_user_from: req.user!.id,
	});

	const liking_me_users = await findLikesByUserTo(database_svc,
	{
		id_user_to: req.user!.id,
	});

	return res.status(200).json(
	{
		likes: {
			by_me: liked_users,
			to_me: liking_me_users,
		},
	});
};
