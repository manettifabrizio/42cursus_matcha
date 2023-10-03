import type { RequestHandler }               from 'express';
import type { Account }                      from '@/feature/auth/entity';
import type { Picture }                      from '@/feature/picture/entity';
import type { Tag }                          from '@/feature/tag/entity';
import type { User }                         from '../../entity';
import { HttpException }                     from '@/core/exception';
import { service as database_svc }           from '@/core/database/service';
import { query as findPicturesByUser }       from '@/feature/picture/use-case/find-by-user/query';
import { query as findTagsByUser }           from '@/feature/user-tag/use-case/find-by-user/query';
import { query as findLike }                 from '@/feature/like/use-case/find/query';
import { query as findBlock }                from '@/feature/block/use-case/find/query';
import { query as findReport }               from '@/feature/report/use-case/find/query';
import { query as createActivity }           from '@/feature/activity/use-case/create/query';
import { query as findUserByIdWithDistance } from '../../use-case/find-by-id-with-distance/query';
import { query as findUserByIdWithPosition } from '../../use-case/find-by-id-with-position/query';

// Type ------------------------------------------------------------------------
type RequestParams =
{
	id_user?: string;
};

type ResponseBody =
	Omit<User, 'id_picture'>
	& Pick<Account, 'username'>
	& {
		picture: Pick<Picture, 'id'|'path'> | null;
		pictures: Pick<Picture, 'id'|'path'>[];
		tags: Tag[];
	}
	& Partial<{
		likes: { by_me: boolean; to_me: boolean; };
		blocks: { by_me: boolean; };
		reports: { by_me: boolean; };
	}>
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (req, res) =>
{
	let user;

	if (req.params.id_user)
	{
		user = await findUserByIdWithDistance(database_svc,
		{
			id: Number(req.params.id_user),
			id_from: req.user!.id,
		});
	}
	else
	{
		user = await findUserByIdWithPosition(database_svc,
		{
			id: req.user!.id,
		});
	}

	if (user === null)
	{
		throw new HttpException('Not Found', {
			cause: `User does not exist.`,
		});
	}

	const pictures = await findPicturesByUser(database_svc, { id_user: user.id });
	const tags = await findTagsByUser(database_svc, { id_user: user.id });

	let profile: ResponseBody =
	{
		...user,
		pictures,
		tags,
	};

	if (user.id !== req.user!.id)
	{
		const has_liked_me = !!(await findLike(database_svc,   { id_user_from: user.id,      id_user_to: req.user!.id }));
		const is_liked =     !!(await findLike(database_svc,   { id_user_from: req.user!.id, id_user_to: user.id }));
		const is_blocked =   !!(await findBlock(database_svc,  { id_user_from: req.user!.id, id_user_to: user.id }));
		const is_reported =  !!(await findReport(database_svc, { id_user_from: req.user!.id, id_user_to: user.id }));

		profile =
		{
			...profile,
			likes:
			{
				by_me: is_liked,
				to_me: has_liked_me,
			},
			blocks:
			{
				by_me: is_blocked,
			},
			reports:
			{
				by_me: is_reported,
			}
		}

		createActivity(database_svc,
		{
			id_user_from: req.user!.id,
			id_user_to: user.id,
			action: 'WATCHED_PROFILE',
		});
	}

	return res.status(200).json(profile);
};
