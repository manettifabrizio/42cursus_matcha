import type { DatabaseService } from "@/core/database/types";
import type { NonNullableProperties } from "@/core/typing";
import type { Picture } from "@/feature/picture/entity";
import type { Position } from "../../entity";
import type { User } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<User, "id"> &
  Partial<
    NonNullableProperties<Omit<User, "id" | "location">> & {
      location: Position;
    }
  >;

type QueryOutput = Partial<
  NonNullableProperties<Omit<User, "id" | "id_picture" | "location">> & {
    picture: Pick<Picture, "id" | "path">;
  } & { location: Position }
> | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const fields_set: string[] = [];
  const fields_return: string[] = ["id_picture"];
  const params: any[] = [dto.id];

  for (const [key, value] of Object.entries(dto)) {
    if (value === undefined) {
      continue;
    }

    switch (key) {
      case "id":
        break;
      case "id_picture":
        fields_set.push(`${key} = $${params.length + 1}`);
        params.push(value);
        break;
      case "location":
        // Note: ST_MakePoint() values are indeed longitude then latitude.
        fields_set.push(
          `location = ST_SetSRID(ST_MakePoint($${params.length + 2}, $${
            params.length + 1
          }), 4326)`
        );
        fields_return.push(
          `ST_X(location::geometry) as longitude, ST_Y(location::geometry) as latitude`
        );
        params.push(dto.location?.latitude);
        params.push(dto.location?.longitude);
        break;
      default:
        fields_set.push(`${key} = $${params.length + 1}`);
        fields_return.push(key);
        params.push(value);
        break;
    }
  }

  const query = `
		WITH edited AS
		(
			UPDATE
				users
			SET
				${fields_set.join(", ")}
			WHERE
				id = $1
			RETURNING
				${fields_return.join(", ")}
		)
		SELECT
			edited.*, path
		FROM
			edited
		LEFT JOIN
			pictures
		ON
			pictures.id = edited.id_picture
	`;

  const result = await database_svc.query<
    Partial<
      NonNullableProperties<Omit<User, "id" | "location">> &
        Position &
        Pick<Picture, "path">
    >
  >(query, params);

  if (result.rowCount === 0) {
    return null;
  }

  const { latitude, longitude, id_picture, path, ...partial_user } =
    result.rows[0];

  const user: QueryOutput = {
    ...partial_user,
  };

  if (latitude !== undefined && longitude !== undefined) {
    user.location = { latitude, longitude };
  }

  if (
    dto.id_picture !== undefined &&
    id_picture !== undefined &&
    path !== undefined
  ) {
    user.picture = { id: id_picture, path };
  }

  return user;
};
