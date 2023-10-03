import type { DatabaseService } from "@/core/database/types";
import type { Block } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Block, "id_user_to">;

type QueryOutput = Omit<Block, "id_user_to">[];

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id_user_from, created_at
		FROM
			blocks
		WHERE
			id_user_to = $1
	`;

  const params = [dto.id_user_to];

  const result = await database_svc.query<Omit<Block, "id_user_to">>(
    query,
    params
  );

  return result.rows;
};
