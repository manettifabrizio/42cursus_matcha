import type { DatabaseService } from '@/core/database/types';
import type { NullableProperties } from '@/core/typing';
import type { Account } from '@/feature/auth/entity';
import type { Picture } from '@/feature/picture/entity';
import type { Distance } from '../../entity';
import type { User } from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput = Pick<User, 'id'> & { id_from: number };

type QueryOutput =
	| (Omit<User, 'id_picture'> &
			Pick<Account, 'username'> & { location: Distance | null } & {
				picture: Pick<Picture, 'id' | 'path'> | null;
			})
	| null;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
): Promise<QueryOutput> => {
	const query = `
		SELECT
			users.id, id_picture, path, username,
			firstname, lastname, birthdate,
			gender, orientation, biography,
			ST_Distance(location, (SELECT location FROM users WHERE id = $2)) / 1000 as distance,
			last_seen_at
		FROM
			users
		INNER JOIN
			accounts
		ON
			accounts.id = users.id
		LEFT JOIN
			pictures
		ON
			pictures.id = id_picture
		WHERE
			users.id = $1
	`;

	const params = [dto.id, dto.id_from];

	const result = await database_svc.query<
		Omit<User, 'location'> &
			Pick<Account, 'username'> &
			NullableProperties<Distance> &
			NullableProperties<Pick<Picture, 'path'>>
	>(query, params);

	if (result.rowCount === 0) {
		return null;
	}

	const { distance, id_picture, path, ...partial_user } = result.rows[0];

	const location = distance !== null ? { distance } : null;
	const picture =
		id_picture !== null && path !== null ? { id: id_picture, path } : null;
	return {
		...partial_user,
		picture,
		location,
	};
};
