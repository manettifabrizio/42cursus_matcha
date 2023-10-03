import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id: string | number;
  firstname: string;
  lastname: string;
};

type ValidationOuput = {
  id: number;
  firstname: string;
  lastname: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [
    Rules.checkId(),
    Rules.checkFirstname(),
    Rules.checkLastname(),
  ];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
