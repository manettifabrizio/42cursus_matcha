import type { DatabaseService } from '@/core/database/types';
import type { Gender, Orientation, User } from '@/feature/user/entity';
import type { Pagination, SortBy, SortOrder } from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput = {
	id_user_from: number;
	recommandation?: boolean;
	age?: {
		min?: number;
		max?: number;
	};
	distance?: {
		min?: number;
		max?: number;
	};
	tags?: {
		min?: number;
		max?: number;
	};
	fame?: {
		min?: number;
		max?: number;
	};
	sort?: {
		by: SortBy;
		order: SortOrder;
	}[];

	page: Pagination;
};

type QueryOutput = Pick<User, 'id'>[];

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
): Promise<QueryOutput> => {
	const params: any[] = [dto.id_user_from];
	const pre_filter: string[] = [];
	const post_filter: string[] = [];
	const pre_sort: string[] = [];
	const post_sort: string[] = [];

	const FAME_SQL = `
		count(DISTINCT l.id_user_from) * 5
		+ count(DISTINCT a.id_user_from)
		- count(DISTINCT b.id_user_from) * 10`;

	pre_filter.push(
		`(gender, orientation) IN (
			SELECT gender, orientation
			FROM get_matching_types((SELECT gender FROM cte_me), (SELECT orientation FROM cte_me))
		)`,
	);

	if (dto.recommandation) {
		pre_sort.push(`
			trunc(distance / 25) * 4 - tags * 2 - fame ASC
		`);
	}

	if (dto.age) {
		const sql = `date_part('year', age(birthdate)) `;

		if (dto.age.min) {
			params.push(Math.trunc(dto.age.min));
			pre_filter.push(`${sql} >= $${params.length}`);
		}
		if (dto.age.max) {
			params.push(Math.trunc(dto.age.max));
			pre_filter.push(`${sql} <= $${params.length}`);
		}
	}

	if (dto.distance) {
		if (dto.distance.min) {
			params.push(Math.trunc(dto.distance.min));
			pre_filter.push(
				`id NOT IN (
					SELECT u.id
					FROM users u
					WHERE ST_DWithin(u.location, (SELECT location FROM cte_me), $${params.length} * 1000)
				)`,
			);
		}
		if (dto.distance.max) {
			params.push(Math.trunc(dto.distance.max));
			pre_filter.push(
				`ST_DWithin(location, (SELECT location FROM cte_me), $${params.length} * 1000)`,
			);
		}
	}

	if (dto.tags) {
		if (dto.tags.min) {
			params.push(Math.trunc(dto.tags.min));
			post_filter.push(`count(DISTINCT ut.id_tag) >= $${params.length}`);
		}
		if (dto.tags.max) {
			params.push(Math.trunc(dto.tags.max));
			post_filter.push(`count(DISTINCT ut.id_tag) <= $${params.length}`);
		}
	}

	if (dto.fame) {
		if (dto.fame.min) {
			params.push(Math.trunc(dto.fame.min));
			post_filter.push(`${FAME_SQL} >= $${params.length}`);
		}
		if (dto.fame.max) {
			params.push(Math.trunc(dto.fame.max));
			post_filter.push(`${FAME_SQL} <= $${params.length}`);
		}
	}

	if (dto.sort) {
		dto.sort.forEach((sort) => {
			post_sort.push(
				`${sort.by.toLowerCase()} ${sort.order.toUpperCase()}`,
			);
		});
	}

	const query = `
		WITH
		cte_me AS
		(
			SELECT
				id, gender, orientation, location
			FROM
				users
			WHERE
				id = $1
		),
		cte_pre_filtered_users AS
		(
			SELECT
				id, birthdate, gender, orientation, location
			FROM
				users
			WHERE
				id != $1
				AND id_picture IS NOT NULL
				AND birthdate IS NOT NULL
				AND location IS NOT NULL
				AND id NOT IN (
					SELECT b.id_user_to FROM blocks b WHERE b.id_user_from = (SELECT id FROM cte_me)
				)
				${pre_filter.length > 0 ? ` AND ${pre_filter.join(' AND ')}` : ``}
		),
		cte_post_filtered_users AS
		(
			SELECT
				id,
				date_part('year', age(birthdate)) as age,
				ST_Distance(location, (SELECT location FROM cte_me)) / 1000.0 as distance,
				count(DISTINCT ut.id_tag) as tags,
				${FAME_SQL} as fame
			FROM
				cte_pre_filtered_users
			LEFT JOIN
				likes l
					ON l.id_user_to = id
						AND l.created_at >= now() - (INTERVAL '1 month')
			LEFT JOIN
				blocks b
					ON b.id_user_to = id
			LEFT JOIN
				activities a
					ON a.id_user_to = id
						AND a.created_at >= now() - (INTERVAL '1 month')
			LEFT JOIN
				users_tags ut
					ON ut.id_user = id
						AND ut.id_tag IN (SELECT id_tag FROM users_tags WHERE id_user = (SELECT id FROM cte_me))
			GROUP BY
				id, birthdate, location
			${post_filter.length > 0 ? `HAVING ${post_filter.join(' AND ')}` : ``}
		),
		cte_pre_sorted_users AS
		(
			SELECT
				*
			FROM
				cte_post_filtered_users
			${pre_sort.length > 0
			? `
					ORDER BY
						${pre_sort.join(', ')}
					LIMIT
						${Math.trunc(dto.page.size)}
					OFFSET
						(${Math.trunc(dto.page.index)} - 1) * ${Math.trunc(dto.page.size)}
					`
			: ``
		}
		)
		SELECT
			id
		FROM
			cte_pre_sorted_users
		${post_sort.length > 0 ? `ORDER BY ${post_sort.join(', ')}` : ``}
		${pre_sort.length <= 0
			? `
				LIMIT
					${Math.trunc(dto.page.size)}
				OFFSET
					(${Math.trunc(dto.page.index)} - 1) * ${Math.trunc(dto.page.size)}
				`
			: ``
		}
	`;

	const result = await database_svc.query<Pick<User, 'id'>>(query, params);

	return result.rows;
};
