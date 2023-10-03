import type { DatabaseService } from "@/core/database/types";
import type { ValidationService } from "@/core/validation/types";
import type { NonNullableProperties } from "@/core/typing";
import type { Picture } from "@/feature/picture/entity";
import type { Position } from "../../entity";
import type { User } from "../../entity";
import { query } from "./query";
import { validate } from "./validate";

// Type ------------------------------------------------------------------------
export type ActionInput = {
  id: string | number;
  id_picture?: string | number;
  firstname?: string;
  lastname?: string;
  birthdate?: string;
  gender?: string;
  orientation?: string;
  biography?: string;
  location?: {
    latitude: string | number;
    longitude: string | number;
  };
};

export type ActionOutput = Partial<
  NonNullableProperties<Omit<User, "id" | "id_picture" | "location">> & {
    picture: Pick<Picture, "id" | "path">;
  } & { location: Position }
> | null;

// Function --------------------------------------------------------------------
export const action = async (
  validation_svc: ValidationService,
  database_svc: DatabaseService,
  dto: ActionInput
): Promise<ActionOutput> => {
  const fields = await validate(validation_svc, dto);

  if (Object.keys(fields).filter((key) => key !== "id").length === 0) {
    return {};
  }

  const user = await query(database_svc, fields);

  return user;
};
