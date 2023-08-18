import { CryptoService }   from '@/core/cryto/types';
import { DatabaseService } from '@/core/database/types';
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
		UPDATE
			accounts
		SET
			password = $1
		WHERE
			id = $2
	`;

	const params =
	[
		await crypto_svc.hashPassword(dto.password),
		dto.id,
	];

	const result = await database_svc.query<{}>(query, params);

	return !!result.rowCount;
};
