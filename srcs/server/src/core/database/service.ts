import { Pool } from 'pg';

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
	throw new DatabaseException({ message: err.message });
});

export const service: DatabaseService =
{
	getClient: pool.connect,
	query: pool.query
};
