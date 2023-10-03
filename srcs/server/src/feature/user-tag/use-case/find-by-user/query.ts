import type { DatabaseService } from "@/core/database/types";
import type { Tag } from "@/feature/tag/entity";
import type { UserTag } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<UserTag, "id_user">;

type QueryOutput = Tag[];

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
		INNER JOIN
			users_tags
		ON
			users_tags.id_tag = tags.id
		WHERE
			id_user = $1
	`;

  const params = [dto.id_user];

  const result = await database_svc.query<Tag>(query, params);

  return result.rows;
};
