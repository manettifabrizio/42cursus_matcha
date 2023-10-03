import type { ValidationChain } from "express-validator";

// Type ------------------------------------------------------------------------
export type ValidationFields = {
  body?: Record<string, any>;
  cookie?: Record<string, any>;
  param?: Record<string, any>;
  header?: Record<string, any>;
  query?: Record<string, any>;
};

export interface ValidationService {
  validate: <T extends Record<string, any>>(
    fields: ValidationFields,
    rules: ValidationChain[]
  ) => Promise<T>;
}
