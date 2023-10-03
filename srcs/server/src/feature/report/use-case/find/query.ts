import type { DatabaseService } from "@/core/database/types";
import type { Report } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Report, "id_user_from" | "id_user_to">;

type QueryOutput = Report | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id_user_from, id_user_to, created_at
		FROM
			reports
		WHERE
			id_user_from = $1 AND id_user_to = $2
	`;

  const params = [dto.id_user_from, dto.id_user_to];

  const result = await database_svc.query<Report>(query, params);

  return result.rows[0] ?? null;
};
