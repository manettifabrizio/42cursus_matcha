import type { DatabaseService } from '@/core/database/types';
import type { Account } from '@/feature/auth/entity';
import type { Picture } from '@/feature/picture/entity';
import type { Tag } from '@/feature/tag/entity';
import type { User } from '../../entity';
import { query as findPicturesByUser } from '@/feature/picture/use-case/find-by-user/query';
import { query as findTagsByUser } from '@/feature/user-tag/use-case/find-by-user/query';
import { query as findLike } from '@/feature/like/use-case/find/query';
import { query as findBlock } from '@/feature/block/use-case/find/query';
import { query as findReport } from '@/feature/report/use-case/find/query';
import { query as getUserFame } from '@/feature/fame/use-case/get-by-user/query';
import { query as findUserByIdWithDistance } from '../find-by-id-with-distance/query';
import { query as findUserByIdWithPosition } from '../find-by-id-with-position/query';

// Type ------------------------------------------------------------------------
export type ActionInput = {
	id_user?: number;
	id_me: number;
};

export type ActionOutput =
	| (Omit<User, 'id_picture'> &
			Pick<Account, 'username'> & {
				picture: Pick<Picture, 'id' | 'path'> | null;
				pictures: Pick<Picture, 'id' | 'path'>[];
				tags: Tag[];
				fame: number;
			} & Partial<Pick<Account, 'email'>>
			& Partial<{
				likes: { by_me: boolean; to_me: boolean };
				blocks: { by_me: boolean };
				reports: { by_me: boolean };
			}> & Partial<Pick<Account, 'email'|'email_new'>>)
	| null;

// Function --------------------------------------------------------------------
export const action = async (
	database_svc: DatabaseService,
	dto: ActionInput,
): Promise<ActionOutput> => {
	let user;

	if (dto.id_user !== undefined) {
		user = await findUserByIdWithDistance(database_svc, {
			id: dto.id_user,
			id_from: dto.id_me,
		});
	} else {
		user = await findUserByIdWithPosition(database_svc, {
			id: dto.id_me,
		});
	}

	if (user === null) {
		return null;
	}

	const pictures = await findPicturesByUser(database_svc, {
		id_user: user.id,
	});
	const tags = await findTagsByUser(database_svc, { id_user: user.id });
	const fame = (await getUserFame(database_svc, { id: user.id })) ?? {
		fame: 0,
	};

	let profile: ActionOutput = {
		...user,
		pictures,
		tags,
		...fame,
	};

	if (user.id !== dto.id_me) {
		const has_liked_me = !!(await findLike(database_svc, {
			id_user_from: user.id,
			id_user_to: dto.id_me,
		}));
		const is_liked = !!(await findLike(database_svc, {
			id_user_from: dto.id_me,
			id_user_to: user.id,
		}));
		const is_blocked = !!(await findBlock(database_svc, {
			id_user_from: dto.id_me,
			id_user_to: user.id,
		}));
		const is_reported = !!(await findReport(database_svc, {
			id_user_from: dto.id_me,
			id_user_to: user.id,
		}));

		profile = {
			...profile,
			likes: {
				by_me: is_liked,
				to_me: has_liked_me,
			},
			blocks: {
				by_me: is_blocked,
			},
			reports: {
				by_me: is_reported,
			},
		};
	}

	return profile;
};
