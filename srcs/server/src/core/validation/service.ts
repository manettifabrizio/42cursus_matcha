import type { ValidationChain } from "express-validator";
import type { ValidationFields } from "./types";
import type { ValidationService } from "./types";
import { matchedData } from "express-validator";
import { validationResult } from "express-validator";
import { ValidationException } from "./exception";

// Function --------------------------------------------------------------------
const validate = async <T extends Record<string, any>>(
  fields: ValidationFields,
  rules: ValidationChain[]
): Promise<T> => {
  await Promise.all(rules.map((rule) => rule.run(fields)));

  const result = validationResult(fields);

  if (result.isEmpty()) {
    return matchedData(fields) as T; // Todo: Use `satisfies`
  }

  const errors = result.array().reduce((acc, error) => {
    switch (error.type) {
      case "field":
        acc[error.path] = [...(acc[error.path] ?? []), error.msg];
        break;

      case "alternative":
        // console.log(error.nestedErrors);
        break;

      case "alternative_grouped":
        error.nestedErrors.forEach((nested_errors) => {
          nested_errors.forEach((field) => {
            acc[field.path] = [...(acc[field.path] ?? []), error.msg];
          });
        });
        break;

      case "unknown_fields":
        error.fields.forEach((field) => {
          acc[field.path] = [...(acc[field.path] ?? []), error.msg];
        });
        break;

      default:
        break;
    }

    return acc;
  }, {} as Record<string, string[]>);

  throw new ValidationException(errors);
};

// Service ---------------------------------------------------------------------
export const service: ValidationService = {
  validate,
};
