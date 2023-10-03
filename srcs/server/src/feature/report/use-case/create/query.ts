import type { DatabaseService } from "@/core/database/types";
import type { Report } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Report, "id_user_from" | "id_user_to">;

type QueryOutput = Report;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		INSERT INTO reports
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

  const result = await database_svc.query<Report>(query, params);

  return result.rows[0];
};
