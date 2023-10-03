import type { DatabaseService } from "@/core/database/types";
import type { Picture } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Picture, "id_user" | "path">;

type QueryOutput = Picture;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		INSERT INTO pictures
		 	( id_user, path )
		VALUES
			( $1, $2 )
		RETURNING
			id, id_user, path
	`;

  const params = [dto.id_user, dto.path];

  const result = await database_svc.query<Picture>(query, params);

  return result.rows[0];
};
