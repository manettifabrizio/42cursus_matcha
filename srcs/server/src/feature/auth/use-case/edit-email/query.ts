import type { CryptoService }   from '@/core/cryto/types';
import type { DatabaseService } from '@/core/database/types';
import type { Account }         from '@/feature/auth/entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<Account, 'id'|'email'>
;

type QueryOutput =
	Pick<Account, 'id'|'email'|'secret'> | null
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
			email = $2,
			secret = $3
		WHERE
			id = $1
		RETURNING
			id, email, secret
	`;

	const params =
	[
		dto.id,
		dto.email,
		await crypto_svc.generateSecret()
	];

	const result = await database_svc.query<Pick<Account, 'id'|'email'|'secret'>>(query, params);

	return result.rows[0] ?? null;
};
