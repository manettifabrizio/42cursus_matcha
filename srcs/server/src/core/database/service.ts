import { DatabaseError }     from 'pg';
import { Pool }              from 'pg';
import { PoolClient }        from 'pg';
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

	const query: DatabaseService['query'] = async (sql, values) =>
	{
		try
		{
			return await (client ?? pool).query(sql, values);
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
				type: err.code === '23505'
					? 'UniqueConstraintViolation'
					: (err.code === '23503')
						? 'ForeignKeyConstraintViolation'
						: 'Unsupported',
				column: err.detail?.substring(err.detail.indexOf('(') + 1, err.detail.indexOf(')'))
			});
		}
	}

	const startTransaction: DatabaseService['startTransaction'] = async () =>
	{
		if (!client)
		{
			client = await pool.connect();
		}

		await query(`BEGIN`);
	};

	const commitTransaction: DatabaseService['commitTransaction'] = async () =>
	{
		await query(`COMMIT`);
	};

	const cancelTransaction: DatabaseService['cancelTransaction'] = async () =>
	{
		await query(`ROLLBACK`);
	};

	const releaseClient: DatabaseService['releaseClient'] = () =>
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
