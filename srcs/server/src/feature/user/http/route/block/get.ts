import type { RequestHandler }           from 'express';
import type { User }                     from '@/feature/user/entity';
import type { Block }                    from '@/feature/block/entity';
import { service as database_svc }       from '@/core/database/service';
import { query as findBlocksByUserFrom } from '@/feature/block/use-case/find-by-user-from/query';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	blocks: {
		by_me: (Pick<User, 'id'> & Pick<Block, 'created_at'>)[];
	};
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const blocked_users = await findBlocksByUserFrom(database_svc,
	{
		id_user_from: req.user!.id,
	});

	return res.status(200).json(
	{
		blocks: {
			by_me: blocked_users,
		},
	});
};
