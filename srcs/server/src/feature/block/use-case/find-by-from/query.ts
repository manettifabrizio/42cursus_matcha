import type { DatabaseService } from '@/core/database/types';
import type { Block }           from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<Block, 'id_user_from'>
;

type QueryOutput =
	Block[]
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
			blocks
		WHERE
			id_user_from = $1
	`;

	const params =
	[
		dto.id_user_from,
	];

	const result = await database_svc.query<Block>(query, params);

	return result.rows;
};
