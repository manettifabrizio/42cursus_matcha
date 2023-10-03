import type { CryptoService } from "@/core/cryto/types";
import type { DatabaseService } from "@/core/database/types";
import type { Account } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Account, "id" | "secret" | "password">;

type QueryOutput = Pick<Account, "id"> | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  crypto_svc: CryptoService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		UPDATE
			accounts
		SET
			password = $3, secret = NULL
		WHERE
			id = $1 AND secret = $2
		RETURNING
			id
	`;

  const params = [
    dto.id,
    dto.secret,
    await crypto_svc.hashPassword(dto.password),
  ];

  const result = await database_svc.query<Pick<Account, "id">>(query, params);

  return result.rows[0] ?? null;
};
