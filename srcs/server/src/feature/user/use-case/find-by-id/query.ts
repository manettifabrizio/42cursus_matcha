import type { DatabaseService } from '@/core/database/types';
import type { User }            from '@/feature/user/entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<User, 'id'>
;

type QueryOutput =
	Omit<User, 'created_at'|'updated_at'> | null
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
			id,
			firstname,
			lastname,
			birthdate,
			gender,
			orientation,
			biography
		FROM
			users
		WHERE
			id = $1
	`;

	const params =
	[
		dto.id,
	];

	const result = await database_svc.query<User>(query, params);

	return result.rows[0] ?? null;
};
