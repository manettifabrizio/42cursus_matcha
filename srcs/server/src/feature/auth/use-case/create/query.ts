import type { CryptoService } from "@/core/cryto/types";
import type { DatabaseService } from "@/core/database/types";
import type { Account } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Account, "username" | "password" | "email">;

type QueryOutput = Pick<Account, "id" | "email" | "secret">;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  crypto_svc: CryptoService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const query = `
		INSERT INTO accounts
			( username, password, email, email_new, secret )
		VALUES
			( $1, $2, $3, $3, $4 )
		RETURNING
			id, email, secret
	`;

  const params = [
    dto.username,
    await crypto_svc.hashPassword(dto.password),
    dto.email,
    await crypto_svc.generateSecret(),
  ];

  const result = await database_svc.query<
    Pick<Account, "id" | "email" | "secret">
  >(query, params);

  return result.rows[0];
};
