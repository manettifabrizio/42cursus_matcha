import type { DatabaseService } from "@/core/database/types";
import type { Tag } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Tag, "name">;

type QueryOutput = Tag;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		INSERT INTO tags
			( name )
		VALUES
			( $1 )
		ON CONFLICT
			( name )
		DO UPDATE SET
			name = $1
		RETURNING
			id, name
	`;

  const params = [dto.name];

  const result = await database_svc.query<Tag>(query, params);

  return result.rows[0];
};
