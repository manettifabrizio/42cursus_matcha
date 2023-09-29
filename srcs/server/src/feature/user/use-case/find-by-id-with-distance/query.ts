import type { DatabaseService } from '@/core/database/types';
import type { Account }         from '@/feature/auth/entity';
import type { Distance }        from '../../entity';
import type { User }            from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<User, 'id'> & { id_from: number }
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
			ST_Distance(
				location,
				(SELECT location FROM users WHERE id = $2)
			) / 1000.0 as distance,
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
		dto.id_from,
	];

	const result = await database_svc.query<Omit<User, 'location'> & Distance & Pick<Account, 'username'>>(query, params);

	if (result.rowCount === 0)
	{
		return null;
	}

	const { distance, ...partial_user } = result.rows[0];

	return {
		...partial_user,
		location:
		{
			distance,
		}
	};
};
