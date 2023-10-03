import { body } from "express-validator";
import { ACTIONS } from "./entity";

// Format ----------------------------------------------------------------------
export const checkIdUserFrom = () =>
  body("id_user_from")
    .trim()
    .isInt({ min: 1 })
    .withMessage(`Activity id_user_from must be an integer > 0.`);

export const checkIdUserTo = () =>
  body("id_user_to")
    .trim()
    .isInt({ min: 1 })
    .withMessage(`Activity id_user_to must be an integer > 0.`);

export const checkAction = () =>
  body("action")
    .trim()
    .toUpperCase()
    .custom((value) => {
      if (!ACTIONS.includes(value)) {
        throw new Error(
          `Action must one of the following value: ${ACTIONS.join(", ")}.`
        );
      }

      return true;
    });
