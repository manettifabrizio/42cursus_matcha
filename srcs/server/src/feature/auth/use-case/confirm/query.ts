import type { DatabaseService } from '@/core/database/types';
import type { Account }         from '@/feature/auth/entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<Account, 'id'|'secret'>
;

type QueryOutput =
	Pick<Account, 'id'> | null
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
		UPDATE
			accounts
		SET
			secret = NULL
		WHERE
			id = $1 AND secret = $2
		RETURNING
			id
	`;

	const params =
	[
		dto.id,
		dto.secret,
	];

	const result = await database_svc.query<Pick<Account, 'id'>>(query, params);

	return result.rows?.[0] ?? null;
};
