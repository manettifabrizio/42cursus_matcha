import type { RequestHandler } from 'express';
import type { User } from '@/feature/user/entity';
import { service as database_svc } from '@/core/database/service';
import { action as findProfileById } from '@/feature/user/use-case/find-profile-by-id/action';
import { query as searchUsersByFilters } from '../../use-case/filter/query';
import { SORT_BY, SORT_ORDER, SortBy, SortOrder } from '../../entity';
import { Account } from '@/feature/auth/entity';
import { Picture } from '@/feature/picture/entity';
import { Tag } from '@/feature/tag/entity';

// Type ------------------------------------------------------------------------
type RequestParams = {
	recommandation?: 'recommandation';
};

type RequestQuery = {
	age_min?: unknown;
	age_max?: unknown;
	distance_min?: unknown;
	distance_max?: unknown;
	tags_min?: unknown;
	tags_max?: unknown;
	fame_min?: unknown;
	fame_max?: unknown;
	sort?: unknown;
	page?: unknown;
};

type ResponseBody = {
	users: (
		| (Omit<User, 'id_picture'> &
			Pick<Account, 'username'> & {
				picture: Pick<Picture, 'id' | 'path'> | null;
				pictures: Pick<Picture, 'id' | 'path'>[];
				tags: Tag[];
				fame: number;
			} & Partial<{
				likes: { by_me: boolean; to_me: boolean; };
				blocks: { by_me: boolean; };
				reports: { by_me: boolean; };
			}>)
		| null
	)[];
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody, {}, RequestQuery> = async (
	req,
	res,
) => {
	const clamp = (value: number, min: number, max: number) =>
		Math.max(min, Math.min(value, max));

	const SANITIZERS: Record<
		keyof RequestQuery,
		(
			value: any,
		) =>
			| undefined
			| number
			| { by: SortBy; order: SortOrder; }[]
	> = {
		page: (index: string) => Math.max(1, Number(index)) || 1,
		age_min: (age: string) => clamp(Number(age), 0, 150) || undefined,
		age_max: (age: string) => clamp(Number(age), 0, 150) || undefined,
		distance_min: (distance: string) =>
			clamp(Number(distance), 0, 60000) || undefined,
		distance_max: (distance: string) =>
			clamp(Number(distance), 0, 60000) || undefined,
		tags_min: (tags: string) => clamp(Number(tags), 0, 1000) || undefined,
		tags_max: (tags: string) => clamp(Number(tags), 0, 1000) || undefined,
		fame_min: (fame: string) => clamp(Number(fame), 0, 1000) || undefined,
		fame_max: (fame: string) => clamp(Number(fame), 0, 1000) || undefined,
		sort: (sorts: string[]) =>
			sorts.reduce((acc, value) => {
				const [by, order] = value.toUpperCase().split(',');

				if (
					SORT_BY.includes(by as SortBy) &&
					SORT_ORDER.includes(order as SortOrder)
				) {
					return [
						...acc,
						{ by, order } as { by: SortBy; order: SortOrder; },
					];
				}

				return acc;
			}, [] as { by: SortBy; order: SortOrder; }[]),
	};

	const filters: any = {
		id_user_from: req.user!.id,
		recommandation: !!req.params.recommandation,
		page: {
			index: 1,
			size: 25,
		},
	};

	Object.entries(SANITIZERS).forEach(([key, sanitize]) => {
		let value: unknown = req.query[key as keyof RequestQuery];

		if (key === 'sort') {
			if (typeof value === 'string') {
				value = [value];
			}

			if (!Array.isArray(value)) {
				return;
			}

			value = sanitize(value.filter((v) => typeof v === 'string'));

			if (Array.isArray(value) && value.length > 0) {
				filters.sort = value;
			}

			return;
		}

		if (Array.isArray(value) && value.length > 0) {
			value = value[value.length - 1];
		}

		if (typeof value === 'string') {
			value = sanitize(value);

			if (
				value === undefined ||
				(Array.isArray(value) && value.length === 0)
			) {
				return;
			}

			switch (key) {
				case 'age_min':
					filters.age = { ...filters.age, min: value };
					break;
				case 'age_max':
					filters.age = { ...filters.age, max: value };
					break;
				case 'distance_min':
					filters.distance = { ...filters.distance, min: value };
					break;
				case 'distance_max':
					filters.distance = { ...filters.distance, max: value };
					break;
				case 'tags_min':
					filters.tags = { ...filters.tags, min: value };
					break;
				case 'tags_max':
					filters.tags = { ...filters.tags, max: value };
					break;
				case 'fame_min':
					filters.fame = { ...filters.fame, min: value };
					break;
				case 'fame_max':
					filters.fame = { ...filters.fame, max: value };
					break;
				case 'page':
					filters.page = { ...filters.page, index: value };
					break;
			}
		}
	});

	const users = await searchUsersByFilters(database_svc, filters);

	const profiles = await Promise.all(
		users.map((user) =>
			findProfileById(database_svc, {
				id_user: user.id,
				id_me: req.user!.id,
			}),
		),
	);

	return res.status(200).json({ users: profiles });
};
