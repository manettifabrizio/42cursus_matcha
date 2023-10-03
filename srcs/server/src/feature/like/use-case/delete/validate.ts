import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id_user_from: string | number;
  id_user_to: string | number;
};

type ValidationOuput = {
  id_user_from: number;
  id_user_to: number;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkIdUserFrom(), Rules.checkIdUserTo()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
