import type { DatabaseService } from "@/core/database/types";
import type { User } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<User, "id" | "firstname" | "lastname">;

type QueryOutput = Pick<User, "id">;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		INSERT INTO users
			( id,  firstname, lastname )
		VALUES
			( $1, $2, $3 )
		RETURNING
			id
	`;

  const params = [dto.id, dto.firstname, dto.lastname];

  const result = await database_svc.query<Pick<User, "id">>(query, params);

  return result.rows[0];
};
