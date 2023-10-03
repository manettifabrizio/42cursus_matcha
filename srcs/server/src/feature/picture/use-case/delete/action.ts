import type { DatabaseService } from "@/core/database/types";
import type { ValidationService } from "@/core/validation/types";
import { validate } from "./validate";
import { query } from "./query";

// Type ------------------------------------------------------------------------
export type ActionInput = {
  id: string | number;
};

export type ActionOutput = boolean;

// Function --------------------------------------------------------------------
export const action = async (
  validation_svc: ValidationService,
  database_svc: DatabaseService,
  dto: ActionInput
): Promise<ActionOutput> => {
  const fields = await validate(validation_svc, dto);
  const is_deleted = await query(database_svc, fields);

  return is_deleted;
};
