import { CryptoService }   from '@/core/cryto/types';
import { DatabaseService } from '@/core/database/types';

import { Account }     from '../../entity';
import { QueryInput }  from './types';
import { QueryOutput } from './types';


export const query = async (
	database_svc: DatabaseService,
	crypto_svc: CryptoService,
	dto : QueryInput,
)
	: Promise<QueryOutput> =>
{
	const query =
	`
		INSERT INTO accounts
		(
			username,
			password,
			email,
			secret
		)
		VALUES
			($1, $2, $3, $4)
		RETURNING
			id,
			secret
	`;

	const params =
	[
		dto.username,
		await crypto_svc.hashPassword(dto.password),
		dto.email,
		await crypto_svc.generateSecret(),
	];

	const result = await database_svc.query<Pick<Account, 'id'|'secret'>>(query, params);

	return result.rows[0];
};
