import type { DatabaseService } from "@/core/database/types";
import type { Like } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Like, "id_user_from" | "id_user_to">;

type QueryOutput = Like;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		INSERT INTO likes
		 	( id_user_from, id_user_to )
		VALUES
			( $1, $2 )
		ON CONFLICT
			( id_user_from, id_user_to )
		DO UPDATE SET
			id_user_from = $1
		RETURNING
			id_user_from, id_user_to, created_at
	`;

  const params = [dto.id_user_from, dto.id_user_to];

  const result = await database_svc.query<Like>(query, params);

  return result.rows[0];
};
