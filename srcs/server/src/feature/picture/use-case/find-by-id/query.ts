import type { DatabaseService } from "@/core/database/types";
import type { Picture } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Picture, "id">;

type QueryOutput = Picture | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id, id_user, path
		FROM
			pictures
		WHERE
			id = $1
	`;

  const params = [dto.id];

  const result = await database_svc.query<Picture>(query, params);

  return result.rows[0] ?? null;
};
