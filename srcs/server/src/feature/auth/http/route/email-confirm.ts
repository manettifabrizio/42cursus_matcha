import type { RequestHandler } from "express";
import { HttpException } from "@/core/exception";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as emailConfirm } from "../../use-case/email-confirm/action";

// Type ------------------------------------------------------------------------
type RequestQuery = {
  id: string;
  secret: string;
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody, {}, RequestQuery> = async (
  req,
  res
) => {
  const account = await emailConfirm(validation_svc, database_svc, {
    id: req.query.id,
    secret: req.query.secret,
  });

  if (account === null) {
    throw new HttpException("Unauthorized", {
      cause: `Invalid credentials.`,
    });
  }

  return res.status(204).send();
};
