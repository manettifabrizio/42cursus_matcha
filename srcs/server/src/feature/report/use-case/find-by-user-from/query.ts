import type { DatabaseService } from '@/core/database/types';
import type { User }            from '@/feature/user/entity';
import type { Report }          from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<Report, 'id_user_from'>
;

type QueryOutput =
	(Pick<User, 'id'> & Pick<Report, 'created_at'>)[]
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
			id_user_to AS id, created_at
		FROM
			reports
		WHERE
			id_user_from = $1
	`;

	const params =
	[
		dto.id_user_from,
	];

	const result = await database_svc.query<Pick<User, 'id'> & Pick<Report, 'created_at'>>(query, params);

	return result.rows ?? [];
};
