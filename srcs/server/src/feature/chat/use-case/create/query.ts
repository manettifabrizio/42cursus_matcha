import type { DatabaseService } from "@/core/database/types";
import type { Message } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Message, "id_user_from" | "id_user_to" | "content">;

type QueryOutput = Message;

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
): Promise<QueryOutput> => {
	const query = `
		INSERT INTO messages
			( id_user_from, id_user_to, content )
		VALUES
			( $1, $2, $3 )
		RETURNING
			id, id_user_from, id_user_to, content, created_at
	`;

	const params = [
		dto.id_user_from,
		dto.id_user_to,
		dto.content
	];

	const result = await database_svc.query<Message>(query, params);

	return result.rows[0];
};
