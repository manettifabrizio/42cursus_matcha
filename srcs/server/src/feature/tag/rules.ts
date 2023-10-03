import { body } from "express-validator";

// Format ----------------------------------------------------------------------
export const checkId = () =>
  body("id")
    .trim()
    .isInt({ min: 1 })
    .withMessage(`Tag id must be an integer > 0.`)
    .toInt();

export const checkName = () =>
  body("name")
    .trim()
    .isLength({ min: 3, max: 21 })
    .withMessage(`Tag name must be between 3 and 21 characters long.`);
