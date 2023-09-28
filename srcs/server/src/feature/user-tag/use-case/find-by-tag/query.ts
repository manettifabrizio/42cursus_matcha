import type { DatabaseService } from '@/core/database/types';
import type { UserTag }         from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<UserTag, 'id_tag'>
;

type QueryOutput =
	UserTag[] | null
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
			id_tag = $1
	`;

	const params =
	[
		dto.id_tag
	];

	const result = await database_svc.query<UserTag>(query, params);

	return result.rows ?? null;
};
