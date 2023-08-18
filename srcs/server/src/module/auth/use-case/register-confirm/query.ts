import { DatabaseService } from '@/core/database/types';
import { Account }         from '../../entity';
import { QueryInput }      from './types';
import { QueryOutput }     from './types';


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
	`;

	const params =
	[
		dto.id,
		dto.secret,
	];

	const result = await database_svc.query<Pick<Account, 'id'>>(query, params);

	return !!result.rowCount;
};
