import type { DatabaseService } from "@/core/database/types";
import type { ValidationService } from "@/core/validation/types";
import type { Account } from "../../entity";
import { query } from "./query";
import { validate } from "./validate";

// Type ------------------------------------------------------------------------
type ActionInput = {
  id: string | number;
};

type ActionOutput = Pick<Account, "id" | "email" | "email_new" | "is_confirmed" | "secret"> | null;

// Function --------------------------------------------------------------------
export const action = async (
  validation_svc: ValidationService,
  database_svc: DatabaseService,
  dto: ActionInput
): Promise<ActionOutput> => {
  const fields = await validate(validation_svc, dto);
  const account = await query(database_svc, fields);

  return account;
};
