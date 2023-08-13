import { Pool } from 'pg';


export interface DatabaseService
{
	getClient: InstanceType<typeof Pool>['connect'];
	query: InstanceType<typeof Pool>['query'];
};
