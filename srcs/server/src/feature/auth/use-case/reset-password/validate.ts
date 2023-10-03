import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  username: string;
  email: string;
};

type ValidationOuput = {
  username: string;
  email: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkUsernameNotEmpty(), Rules.checkEmailNotEmpty()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
