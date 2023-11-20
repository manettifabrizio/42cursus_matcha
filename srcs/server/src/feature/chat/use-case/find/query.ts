import type { DatabaseService } from "@/core/database/types";
import type { Message } from "../../entity";
import type { Pagination } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = {
	id_user_from: number;
	id_user_to: number;
	page: Pagination;
};

type QueryOutput = Message[];

// Function --------------------------------------------------------------------
export const query = async (
	database_svc: DatabaseService,
	dto: QueryInput,
): Promise<QueryOutput> => {
	const query = `
		SELECT
			id, id_user_from, id_user_to, content, created_at
		FROM
			messages
		WHERE
			   (id_user_from = $1 AND id_user_to = $2)
			OR (id_user_from = $2 AND id_user_to = $1)
		ORDER BY
			created_at DESC
		LIMIT
			${Math.trunc(dto.page.size)}
		OFFSET
			(${Math.trunc(dto.page.index)} - 1) * ${Math.trunc(dto.page.size)}
	`;

	const params = [
		dto.id_user_from,
		dto.id_user_to,
	];

	const result = await database_svc.query<Message>(query, params);

	return result.rows;
};
