import type { DatabaseService } from "@/core/database/types";
import type { UserTag } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = UserTag;

type QueryOutput = boolean;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		DELETE FROM
			users_tags
		WHERE
			id_user = $1 AND id_tag = $2
	`;

  const params = [dto.id_user, dto.id_tag];

  const result = await database_svc.query<UserTag>(query, params);

  return result.rowCount > 0;
};
