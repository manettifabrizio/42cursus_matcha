import { DatabaseService } from '@/core/database/types';

import { Account }     from '../../entity';
import { QueryInput }  from './types';
import { QueryOutput } from './types';


export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
)
	: Promise<QueryOutput> =>
{
	const sql =
	`
		SELECT
			id,
			username,
			password,
			email,
			secret,
			created_at,
			updated_at
		FROM
			accounts
		WHERE
			username = $1
	`;

	const params =
	[
		dto.username
	];

	const result = await database_svc.query<Account>(sql, params);

	return result.rows[0] ?? null;
};
