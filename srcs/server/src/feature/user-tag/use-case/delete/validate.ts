import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id_user: string | number;
  id_tag: string | number;
};

type ValidationOuput = {
  id_user: number;
  id_tag: number;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [Rules.checkIdUser(), Rules.checkIdTag()];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
