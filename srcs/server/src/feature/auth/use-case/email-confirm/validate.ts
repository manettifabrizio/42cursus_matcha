import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id: string | number;
  secret: string;
};

type ValidationOuput = {
  id: number;
  secret: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkId(), Rules.checkSecretNotEmpty()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
