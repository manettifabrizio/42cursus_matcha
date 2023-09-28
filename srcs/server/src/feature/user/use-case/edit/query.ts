import type { DatabaseService } from '@/core/database/types';
import type { Override }        from '@/core/typing';
import type { Position }        from '../../entity';
import type { User }            from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput =
	Pick<User, 'id'> & Partial<Override<Omit<User, 'id'>, { 'location': Position }>>
;

type QueryOutput =
	Partial<Omit<User, 'id'>> | null
;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto : QueryInput,
)
	: Promise<QueryOutput> =>
{
	const fields_set: string[] = [];
	const fields_return: string[] = [];
	const params: any[] = [ dto.id ];

	Object.entries(dto).forEach(([key, value]) =>
	{
		if (value === undefined)
		{
			return;
		}

		switch (key)
		{
			case 'id':
				break;
			case 'location':
				// Note: ST_MakePoint() values are indeed longitude then latitude.
				fields_set.push(`location = ST_SetSRID(ST_MakePoint($${params.length + 2}, $${params.length + 1}), 4326)`);
				fields_return.push(`ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude`);
				params.push(dto.location?.latitude);
				params.push(dto.location?.longitude);
				break;
			default:
				fields_set.push(`${key} = $${params.length + 1}`);
				fields_return.push(key);
				params.push(value);
				break;
		}
	});

	const query =
	`
		UPDATE
			users
		SET
			${fields_set.join(', ')}
		WHERE
			id = $1
		RETURNING
			${fields_return.join(', ')}
	`;

	const result = await database_svc.query<Partial<Omit<User, 'id'|'location'> & Position>>(query, params);

	if (result.rowCount === 0)
	{
		return null;
	}

	const { latitude, longitude, ...partial_user } = result.rows[0];

	const updated: Partial<Omit<User, 'id'>> =
	{
		...partial_user,
	}

	if (latitude !== undefined && longitude !== undefined)
	{
		updated.location =
		{
			latitude,
			longitude,
		};
	}

	return updated;
};
