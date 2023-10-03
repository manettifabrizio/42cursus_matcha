import type { DatabaseService } from "@/core/database/types";
import type { User } from "@/feature/user/entity";
import type { Report } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Report, "id_user_from">;

type QueryOutput = Omit<Report, "id_user_from">[];

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id_user_to, created_at
		FROM
			reports
		WHERE
			id_user_from = $1
	`;

  const params = [dto.id_user_from];

  const result = await database_svc.query<Omit<Report, "id_user_from">>(
    query,
    params
  );

  return result.rows ?? [];
};
