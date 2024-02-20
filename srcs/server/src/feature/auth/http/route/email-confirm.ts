import type { RequestHandler } from "express";
import { HttpException } from "@/core/exception";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as confirmEmail } from "../../use-case/email-confirm/action";
import { action as getAccountById } from "../../use-case/find-by-id/action";

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
  const confirmed = await confirmEmail(validation_svc, database_svc, {
    id: req.query.id,
    secret: req.query.secret,
  });

  if (confirmed === null) {
    const account = await getAccountById(validation_svc, database_svc, {
      id: req.query.id
    });

    if (account?.is_confirmed && (!account.email_new || account.email === account.email_new)) {
      throw new HttpException("Unprocessable Entity", {
        cause: `Email has already been confirmed.`,
      });
    }

    throw new HttpException("Unauthorized", {
      cause: `Invalid credentials.`,
    });
  }

  return res.status(204).send();
};
