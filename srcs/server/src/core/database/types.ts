import { QueryResult }    from 'pg';
import { QueryResultRow } from 'pg';


export interface DatabaseService
{
	query: <R extends QueryResultRow>(sql: string, values?: any[]) => Promise<QueryResult<R>>;
	startTransaction: () => Promise<void>;
	commitTransaction: () => Promise<void>;
	cancelTransaction: () => Promise<void>;
	releaseClient: () => void;
};
