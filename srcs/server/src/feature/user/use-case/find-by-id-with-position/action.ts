import type { DatabaseService } from "@/core/database/types";
import type { ValidationService } from "@/core/validation/types";
import type { Account } from "@/feature/auth/entity";
import type { Picture } from "@/feature/picture/entity";
import type { Position } from "../../entity";
import type { User } from "../../entity";
import { query } from "./query";
import { validate } from "./validate";

// Type ------------------------------------------------------------------------
export type ActionInput = {
  id: string | number;
};

export type ActionOutput =
  | (Omit<User, "id_picture" | "location"> &
      Pick<Account, "username" | "email" | "email_new">
      & { location: Position | null } & {
        picture: Pick<Picture, "id" | "path"> | null;
      })
  | null;

// Function --------------------------------------------------------------------
export const action = async (
  validation_svc: ValidationService,
  database_svc: DatabaseService,
  dto: ActionInput
): Promise<ActionOutput> => {
  const fields = await validate(validation_svc, dto);
  const user = await query(database_svc, fields);

  return user;
};
