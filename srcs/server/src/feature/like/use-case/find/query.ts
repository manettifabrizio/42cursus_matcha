import type { DatabaseService } from '@/core/database/types';
import type { Like }            from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Like
;

type QueryOutput =
	Like | null
;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto : QueryInput,
)
	: Promise<QueryOutput> =>
{
	const query =
	`
		SELECT
			id_user_from, id_user_to
		FROM
			likes
		WHERE
			id_user_from = $1 AND id_user_to = $2
	`;

	const params =
	[
		dto.id_user_from,
		dto.id_user_to,
	];

	const result = await database_svc.query<Like>(query, params);

	return result.rows[0] ?? null;
};
