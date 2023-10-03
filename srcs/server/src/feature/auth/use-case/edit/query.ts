import type { CryptoService } from "@/core/cryto/types";
import type { DatabaseService } from "@/core/database/types";
import type { Account } from "../../entity";

// Type ------------------------------------------------------------------------
type QueryInput = Pick<Account, "id"> &
  Partial<Pick<Account, "email" | "password">>;

type QueryOutput = Partial<Pick<Account, "id" | "email" | "secret">> | null;

// Function --------------------------------------------------------------------
export const query = async (
  database_svc: DatabaseService,
  crypto_svc: CryptoService,
  dto: QueryInput
): Promise<QueryOutput> => {
  const fields_set: string[] = [];
  const fields_return: string[] = [];
  const params: any[] = [dto.id];

  for (const [key, value] of Object.entries(dto)) {
    if (value === undefined) {
      continue;
    }

    switch (key) {
      case "id":
        break;
      case "email":
        fields_set.push(
          `email_new = $${params.length + 1}, secret = $${params.length + 2}`
        );
        params.push(value);
        params.push(await crypto_svc.generateSecret());
        fields_return.push("id");
        fields_return.push("email_new AS email");
        fields_return.push("secret");
        break;
      case "password":
        fields_set.push(`${key} = $${params.length + 1}`);
        params.push(await crypto_svc.hashPassword(value as string));
        break;
      default:
        break;
    }
  }

  const query = `
		UPDATE
			accounts
		SET
			${fields_set.join(", ")}
		WHERE
			id = $1
		${fields_return.length > 0 ? "RETURNING" : ""}
			${fields_return.join(", ")}
	`;

  const result = await database_svc.query<
    Partial<Pick<Account, "id" | "email" | "secret">>
  >(query, params);

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0] ?? {};
};
