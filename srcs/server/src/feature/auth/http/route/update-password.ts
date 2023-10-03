import type { RequestHandler } from "express";
import { HttpException } from "@/core/exception";
import { service as crypto_svc } from "@/core/cryto/service";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as updatePassword } from "../../use-case/update-password/action";

// Type ------------------------------------------------------------------------
type RequestQuery = {
  id: string;
  secret: string;
};

type RequestBody = {
  password: string;
  password_confirm: string;
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<
  {},
  ResponseBody,
  RequestBody,
  RequestQuery
> = async (req, res) => {
  const account = await updatePassword(
    validation_svc,
    database_svc,
    crypto_svc,
    {
      id: req.query.id,
      secret: req.query.secret,
      password: req.body.password,
      password_confirm: req.body.password_confirm,
    }
  );

  if (account === null) {
    throw new HttpException("Unauthorized", {
      cause: `Invalid credentials.`,
    });
  }

  return res.status(204).send();
};
