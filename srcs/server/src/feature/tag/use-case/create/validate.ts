import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  name: string;
};

type ValidationOuput = {
  name: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkName()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
