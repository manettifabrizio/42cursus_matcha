import type { CryptoService } from "@/core/cryto/types";
import type { DatabaseService } from "@/core/database/types";
import type { ValidationService } from "@/core/validation/types";
import type { Account } from "../../entity";
import { query } from "./query";
import { validate } from "./validate";

// Type ------------------------------------------------------------------------
type ActionInput = {
  username: string;
  email: string;
};

type ActionOutput = Pick<
  Account,
  "id" | "email" | "secret" | "is_confirmed"
> | null;

// Function --------------------------------------------------------------------
export const action = async (
  validation_svc: ValidationService,
  database_svc: DatabaseService,
  crypto_svc: CryptoService,
  dto: ActionInput
): Promise<ActionOutput> => {
  const fields = await validate(validation_svc, dto);
  const account = await query(database_svc, crypto_svc, fields);

  return account;
};
