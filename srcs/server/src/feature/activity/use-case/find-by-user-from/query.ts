import type { DatabaseService } from "@/core/database/types";
import type { Activity } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Activity, "id_user_from">;

type QueryOutput = Omit<Activity, "id_user_from">[];

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id_user_to, action, created_at
		FROM
			activities
		WHERE
			id_user_from = $1
	`;

  const params = [dto.id_user_from];

  const result = await database_svc.query<Omit<Activity, "id_user_from">>(
    query,
    params
  );

  return result.rows;
};
