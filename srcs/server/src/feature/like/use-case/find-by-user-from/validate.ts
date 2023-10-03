import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id_user_from: string | number;
};

type ValidationOuput = {
  id_user_from: number;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkIdUserFrom()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
