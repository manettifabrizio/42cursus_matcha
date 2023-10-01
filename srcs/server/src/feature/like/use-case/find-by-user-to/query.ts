import type { DatabaseService } from '@/core/database/types';
import type { User }            from '@/feature/user/entity';
import type { Like }            from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<Like, 'id_user_to'>
;

type QueryOutput =
	(Pick<User, 'id'> & Pick<Like, 'created_at'>)[]
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
			id_user_from, id_user_to, created_at
		FROM
			likes
		WHERE
			id_user_to = $1
	`;

	const params =
	[
		dto.id_user_to,
	];

	const result = await database_svc.query<Pick<User, 'id'> & Pick<Like, 'created_at'>>(query, params);

	return result.rows;
};
