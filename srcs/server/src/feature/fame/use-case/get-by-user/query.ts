import type { DatabaseService } from '@/core/database/types';
import type { User } from '@/feature/user/entity';

// Type ------------------------------------------------------------------------
type QueryInput = Pick<User, 'id'>;

type QueryOutput = { fame: number } | null;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
): Promise<QueryOutput> => {
	const query = `
		SELECT
			count(DISTINCT likes.id_user_from) * 5
				+ count(DISTINCT activities.id_user_from)
				- count(DISTINCT blocks.id_user_from) * 10
			AS fame
		FROM
			users
		LEFT JOIN
			likes
				ON likes.id_user_to = users.id
		LEFT JOIN
			blocks
				ON blocks.id_user_to = users.id
		LEFT JOIN
			activities
				ON activities.id_user_to = users.id
		WHERE
			users.id = $1
		GROUP BY
			users.id
	`;

	const params = [dto.id];

	const result = await database_svc.query<{ fame: number }>(query, params);

	return result.rows[0] ?? null;
};
