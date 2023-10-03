import type { DatabaseService } from "@/core/database/types";
import type { ValidationService } from "@/core/validation/types";
import type { Tag } from "../../entity";
import { query } from "./query";
import { validate } from "./validate";

// Type ------------------------------------------------------------------------
export type ActionInput = {
  name: string;
};

export type ActionOutput = Tag;

// Function --------------------------------------------------------------------
export const action = async (
  validation_svc: ValidationService,
  database_svc: DatabaseService,
  dto: ActionInput
): Promise<ActionOutput> => {
  const fields = await validate(validation_svc, dto);
  const tag = await query(database_svc, fields);

  return tag;
};
