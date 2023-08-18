import { CryptoService }   from '@/core/cryto/types';
import { DatabaseService } from '@/core/database/types';
import { Account }         from '../../entity';
import { QueryInput }      from './types';
import { QueryOutput }     from './types';


export const query = async (
	database_svc: DatabaseService,
	crypto_svc: CryptoService,
	dto : QueryInput,
)
	: Promise<QueryOutput> =>
{
	const query =
	`
		SELECT
			id, password
		FROM
			accounts
		WHERE
			username = $1 AND secret IS NULL
	`;

	const params =
	[
		dto.username,
	];

	const result = await database_svc.query<Pick<Account, 'id'|'password'>>(query, params);

	if (!result.rowCount || !await crypto_svc.verifyPassword(dto.password, result.rows[0].password))
	{
		return null;
	}

	return {
		id: result.rows[0].id,
	};
};
