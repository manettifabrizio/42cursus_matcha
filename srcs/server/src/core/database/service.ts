import { DatabaseError, Pool }           from 'pg';
import { PoolClient }     from 'pg';
import { QueryResult }    from 'pg';
import { QueryResultRow } from 'pg';

import * as Config           from '@/Config';
import { DatabaseException } from './exception';
import { DatabaseService }   from './types';


const pool = new Pool({
	host:     Config.DB_HOST,
	port:     Number.parseInt(Config.DB_PORT),
	database: Config.DB_NAME,
	user:     Config.DB_USER,
	password: Config.DB_PASS,
});

pool.on('error', (err, client) =>
{
	throw new DatabaseException({
		type: 'PoolInitFailed',
		message: err.message,
	});
});

export const service: DatabaseService = ((pool: Pool) =>
{
	let client: PoolClient | null = null;

	const query = async <
		R extends QueryResultRow = any
	>(
		sql: string,
		values?: any[],
	)
		: Promise<QueryResult<R>> =>
	{
		try
		{
			return await (client ?? pool).query<R>(sql, values);
		}
		catch (err: unknown)
		{
			if (!(err instanceof DatabaseError))
			{
				throw err;
			}

			// Todo: Better handling of errors
			// https://www.postgresql.org/docs/current/errcodes-appendix.html

			throw new DatabaseException({
				type: err.code === '23505' ? 'UniqueConstraintViolation' : (err.code === '23503') ? 'ForeignKeyConstraintViolation' : 'Unsupported',
				column: err.detail?.substring(err.detail.indexOf('(') + 1, err.detail.indexOf(')'))
			});
		}
	}

	const startTransaction = async () : Promise<void> =>
	{
		if (!client)
		{
			client = await pool.connect();
		}

		await query(`BEGIN`);
	};

	const commitTransaction = async () : Promise<void> =>
	{
		await query(`COMMIT`);
	};

	const cancelTransaction = async () : Promise<void> =>
	{
		await query(`ROLLBACK`);
	};

	const releaseClient = () : void =>
	{
		client?.release();
	};

	return {
		releaseClient,
		startTransaction,
		commitTransaction,
		cancelTransaction,
		query
	};
})(pool);
