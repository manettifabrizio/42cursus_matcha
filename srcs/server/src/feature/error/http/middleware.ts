import type { ErrorRequestHandler } from "express";
import { HttpException } from "@/core/exception";
import { DatabaseException } from "@/core/database/exception";
import { ValidationException } from "@/core/validation/exception";
import { JwtException } from "@/core/jwt/exception";
import { UploadException } from "@/core/upload/exception";

// Function --------------------------------------------------------------------
export const middleware: ErrorRequestHandler = async (
  err: unknown,
  req,
  res,
  next
) => {
  if (err instanceof JwtException) {
    err = new HttpException("Unauthorized", err.data);
  }

  if (err instanceof DatabaseException) {
    switch (err.data.cause) {
      case "Query:ConstraintsViolation:Unique":
        if (err.data.details!.column === 'email_new') {
          err.data.details!.column = 'email';
        }
        err = new ValidationException({
          [err.data.details!.column]: [`Already in use.`],
        });
        break;
      case "Query:ConstraintsViolation:ForeignKey":
        err = new ValidationException({
          [err.data.details!.column]: [`Does not exist.`],
        });
        break;
      case "Query:ConstraintsViolation:Restrict":
        err = new ValidationException({
          [err.data.details!.column]: [err.data.message],
        });
        break;
      default:
        break;
    }
  }

  if (err instanceof UploadException) {
    err = new ValidationException(err.data);
  }

  if (err instanceof ValidationException) {
    err = new HttpException("Unprocessable Entity", {
      cause: `See details.`,
      details: err.data,
    });
  }

  // Uniform error responses
  const error =
    err instanceof HttpException
      ? err
      : new HttpException("Internal Server Error", {
          cause: String(err),
        });
  res.status(error.code).json({
    status: {
      code: error.code,
      text: error.type,
    },
    error: error.data,
  });
};
