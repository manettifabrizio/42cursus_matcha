import type { RequestHandler } from 'express';
import type { Account } from '@/feature/auth/entity';
import type { Picture } from '@/feature/picture/entity';
import type { Tag } from '@/feature/tag/entity';
import type { User } from '../../entity';
import { HttpException } from '@/core/exception';
import { service as database_svc } from '@/core/database/service';
import { service as socket_svc } from '@/core/socket/service';
import { action as findProfileById } from '../../use-case/find-profile-by-id/action';
import { query as createActivity } from '@/feature/activity/use-case/create/query';

// Type ------------------------------------------------------------------------
type RequestParams = {
	id_user?: string;
};

type ResponseBody = Omit<User, 'id_picture'> &
	Pick<Account, 'username'> & {
		picture: Pick<Picture, 'id' | 'path'> | null;
		pictures: Pick<Picture, 'id' | 'path'>[];
		tags: Tag[];
		fame: number;
	} & Partial<{
		likes: { by_me: boolean; to_me: boolean };
		blocks: { by_me: boolean };
		reports: { by_me: boolean };
	}>;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (
	req,
	res,
) => {
	const id_user =
		req.params.id_user !== undefined
			? Number(req.params.id_user) || -1
			: undefined;

	const profile = await findProfileById(database_svc, {
		id_user,
		id_me: req.user!.id,
	});

	if (profile === null) {
		throw new HttpException('Not Found', {
			cause: `User does not exist.`,
		});
	}

	createActivity(database_svc, {
		id_user_from: req.user!.id,
		id_user_to: profile.id,
		action: 'WATCHED_PROFILE',
	});

	socket_svc.io()
		.to(`user-${profile.id}`)
		.emit('profile:view', { id_user_from: req.user!.id });

	return res.status(200).json(profile);
};
