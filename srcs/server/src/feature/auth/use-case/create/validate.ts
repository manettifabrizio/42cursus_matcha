import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  username: string;
  password: string;
  password_confirm: string;
  email: string;
};

type ValidationOuput = {
  username: string;
  password: string;
  email: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = [
    Rules.checkUsername(),
    Rules.checkPassword(),
    Rules.checkPasswordConfirm(),
    Rules.checkEmail(),
  ];

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
