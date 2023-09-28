import type { DatabaseService } from '@/core/database/types';
import type { User }            from '../../entity';
import type { Position }        from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<User, 'id'>
;

type QueryOutput =
	User | null
;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto : QueryInput,
)
	: Promise<QueryOutput> =>
{
	const query =
	`
		SELECT
			id, firstname, lastname, birthdate,
			gender, orientation, biography,
			ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude
		FROM
			users
		WHERE
			id = $1
	`;

	const params =
	[
		dto.id,
	];

	const result = await database_svc.query<Omit<User, 'location'> & Position>(query, params);

	if (!result.rows[0])
	{
		return null;
	}

	const { latitude, longitude, ...partial_user } = result.rows[0];

	return {
		...partial_user,
		location:
		{
			latitude,
			longitude,
		},
	};
};
