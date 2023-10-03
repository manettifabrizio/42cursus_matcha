import type { DatabaseService } from "@/core/database/types";
import type { UserTag } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = UserTag;

type QueryOutput = UserTag;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		INSERT INTO users_tags
			( id_user, id_tag )
		VALUES
			( $1, $2 )
		ON CONFLICT
			( id_user, id_tag )
		DO UPDATE SET
			id_user = $1
		RETURNING
			id_user, id_tag
	`;

  const params = [dto.id_user, dto.id_tag];

  const result = await database_svc.query<UserTag>(query, params);

  return result.rows[0];
};
