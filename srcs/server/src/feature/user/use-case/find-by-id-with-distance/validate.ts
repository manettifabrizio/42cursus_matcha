import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id: string | number;
  id_from: string | number;
};

type ValidationOuput = {
  id: number;
  id_from: number;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkId(), Rules.checkIdFrom()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
