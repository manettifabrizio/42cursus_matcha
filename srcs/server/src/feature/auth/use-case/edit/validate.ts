import type { ValidationService } from "@/core/validation/types";
import * as Rules from "../../rules";

// Type ------------------------------------------------------------------------
type ValidationInput = {
  id: string | number;
  email?: string;
  password?: string;
  password_confirm?: string;
};

type ValidationOuput = {
  id: number;
  email?: string;
  password?: string;
  password_confirm?: string;
};

// Function --------------------------------------------------------------------
export const validate = async (
  validation_svc: ValidationService,
  dto: ValidationInput
): Promise<ValidationOuput> => {
  const rules = Object.entries(dto)
    .map(([key, value]) => {
      if (value === undefined) {
        return [];
      }

      switch (key) {
        case "id":
          return Rules.checkId();
        case "email":
          return Rules.checkEmail();
        case "password":
          return [Rules.checkPassword(), Rules.checkPasswordConfirm()];
        default:
          return [];
      }
    })
    .flat();

  return validation_svc.validate<ValidationOuput>({ body: dto }, rules);
};
