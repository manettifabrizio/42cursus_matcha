import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  username: string;
  password: string;
};

type ValidationOuput = {
  username: string;
  password: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkUsernameNotEmpty(), Rules.checkPasswordNotEmpty()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
