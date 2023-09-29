import type { DatabaseService } from '@/core/database/types';
import type { Tag }             from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
{
	ids: Tag['id'][]
};

type QueryOutput =
	Tag[]
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
			id, name
		FROM
			tags
		WHERE
			id = ANY($1::integer[])
	`;

	const params =
	[
		dto.ids
	];

	const result = await database_svc.query<Tag>(query, params);

	return result.rows;
};
