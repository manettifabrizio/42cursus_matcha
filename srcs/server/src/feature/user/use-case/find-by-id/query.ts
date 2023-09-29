import type { DatabaseService } from '@/core/database/types';
import type { Account }         from '@/feature/auth/entity';
import type { User }            from '../../entity';
import type { Position }        from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<User, 'id'>
;

type QueryOutput =
	User & Pick<Account, 'username'> | null
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
			users.id, id_picture, firstname, lastname, birthdate,
			gender, orientation, biography,
			ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude,
			username
		FROM
			users
		INNER JOIN
			accounts
		ON
			accounts.id = users.id
		WHERE
			id = $1
	`;

	const params =
	[
		dto.id,
	];

	const result = await database_svc.query<Omit<User, 'location'> & Position & Pick<Account, 'username'>>(query, params);

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
