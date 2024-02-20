import type { DatabaseService } from "@/core/database/types";
import type { Account } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Account, "id">;

type QueryOutput = Pick<Account, "id" | "email" | "email_new" | "is_confirmed" | "secret"> | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id, email, email_new, is_confirmed, secret
		FROM
			accounts
		WHERE
			id = $1
	`;

  const params = [dto.id];

  const result = await database_svc.query<
    Pick<Account, "id" | "email" | "email_new" | "is_confirmed" | "secret">
  >(query, params);

  return result.rows[0] ?? null;
};
