import type { CryptoService } from "@/core/cryto/types";
import type { DatabaseService } from "@/core/database/types";
import type { Account } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Account, "username" | "password">;

type QueryOutput = Pick<Account,
  "id" | "email" | "email_new" | "secret" | "is_confirmed"> | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  crypto_svc: CryptoService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		SELECT
			id, password, email, email_new, secret, is_confirmed
		FROM
			accounts
		WHERE
			username = $1
	`;

  const params = [dto.username];

  const result = await database_svc.query<
    Pick<Account, "id" | "password" | "email" | "email_new" | "secret" | "is_confirmed">
  >(query, params);

  if (result.rowCount === 0) {
    return null;
  }

  const { password, ...partial_account } = result.rows[0];

  if (!(await crypto_svc.verifyPassword(dto.password, password))) {
    return null;
  }

  return partial_account;
};
