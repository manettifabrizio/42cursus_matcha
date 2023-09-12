import type { CryptoService }   from '@/core/cryto/types';
import type { DatabaseService } from '@/core/database/types';
import type { Account }         from '@/feature/auth/entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<Account, 'id'|'password'>
;

type QueryOutput =
	Pick<Account, 'id'> | null
;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	crypto_svc: CryptoService,
	dto : QueryInput,
)
	: Promise<QueryOutput> =>
{
	const query =
	`
		UPDATE
			accounts
		SET
			password = $1
		WHERE
			id = $2
		RETURNING
			id
	`;

	const params =
	[
		await crypto_svc.hashPassword(dto.password),
		dto.id,
	];

	const result = await database_svc.query<Pick<Account, 'id'>>(query, params);

	return result.rows[0] ?? null;
};
