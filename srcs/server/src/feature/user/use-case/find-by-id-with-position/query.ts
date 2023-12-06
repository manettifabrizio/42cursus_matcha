import type { DatabaseService } from '@/core/database/types';
import type { NullableProperties } from '@/core/typing';
import type { Account } from '@/feature/auth/entity';
import type { Picture } from '@/feature/picture/entity';
import type { Position } from '../../entity';
import type { User } from '../../entity';

// Type ------------------------------------------------------------------------
type QueryInput = Pick<User, 'id'>;

type QueryOutput =
	| (Omit<User, 'id_picture' | 'location'> &
			Pick<Account, 'username' | 'email' | 'email_new'>
			& { location: Position | null }
			& { picture: Pick<Picture, 'id' | 'path'> | null;}
		)
	| null;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
): Promise<QueryOutput> => {
	const query = `
		SELECT
			users.id, id_picture, path, username, email, email_new,
			firstname, lastname, birthdate,
			gender, orientation, biography,
			ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude,
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

	const params = [dto.id];

	const result = await database_svc.query<
		Omit<User, 'location'> &
			NullableProperties<Position> &
			Pick<Account, 'username' | 'email' | 'email_new'> &
			Pick<Picture, 'path'>
	>(query, params);

	if (!result.rows[0]) {
		return null;
	}

	const { latitude, longitude, id_picture, path, ...partial_user } =
		result.rows[0];

	const location =
		latitude !== null && longitude !== null
			? { latitude, longitude }
			: null;
	const picture = id_picture !== null ? { id: id_picture, path } : null;
	return {
		...partial_user,
		picture,
		location,
	};
};
