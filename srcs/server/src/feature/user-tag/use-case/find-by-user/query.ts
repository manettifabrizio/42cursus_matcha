import type { DatabaseService } from '@/core/database/types';
import type { UserTag }         from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<UserTag, 'id_user'>
;

type QueryOutput =
	UserTag[]
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
			id_user, id_tag
		FROM
			users_tags
		WHERE
			id_user = $1
	`;

	const params =
	[
		dto.id_user
	];

	const result = await database_svc.query<UserTag>(query, params);

	return result.rows;
};
