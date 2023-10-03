import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id_user: string | number;
  path: string;
};

type ValidationOuput = {
  id_user: number;
  path: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkIdUser(), Rules.checkPath()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
