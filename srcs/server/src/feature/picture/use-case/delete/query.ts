import type { DatabaseService } from "@/core/database/types";
import type { Picture } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Picture, "id">;

type QueryOutput = boolean;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		DELETE FROM
			pictures
		WHERE
			id = $1
	`;

  const params = [dto.id];

  const result = await database_svc.query(query, params);

  return result.rowCount > 0;
};
