import type { DatabaseService } from "@/core/database/types";
import type { Tag } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Tag, "id">;

type QueryOutput = Tag | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id, name
		FROM
			tags
		WHERE
			id = $1
	`;

  const params = [dto.id];

  const result = await database_svc.query<Tag>(query, params);

  return result.rows[0] ?? null;
};
