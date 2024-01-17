import type { DatabaseService } from '@/core/database/types';
import type { Activity } from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Activity, 'id_user_from' | 'id_user_to' | 'action'>;

type QueryOutput = boolean;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
): Promise<QueryOutput> => {
	const query = `
	INSERT INTO activities
		( id_user_from, id_user_to, action )
	SELECT
		$1, $2, $3
	WHERE NOT EXISTS
	(
		SELECT
			*
		FROM
			activities
        WHERE id_user_from = $1 AND id_user_to = $2 AND created_at > NOW() - (15 || ' minutes')::interval
	)
	`;

	const params = [dto.id_user_from, dto.id_user_to, dto.action];

	const result = await database_svc.query(query, params);

	return result.rowCount > 0;
};
