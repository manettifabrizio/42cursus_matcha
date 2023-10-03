import type { RequestHandler } from "express";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as createReport } from "@/feature/report/use-case/create/action";
import { query as deleteLike } from "@/feature/like/use-case/delete/query";

// Type ------------------------------------------------------------------------
type RequestParams = {
  id_user: string;
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (
  req,
  res
) => {
  try {
    database_svc.startTransaction();

    await createReport(validation_svc, database_svc, {
      id_user_from: req.user!.id,
      id_user_to: Number(req.params.id_user),
    });

    await deleteLike(database_svc, {
      id_user_from: req.user!.id,
      id_user_to: Number(req.params.id_user),
    });

    database_svc.commitTransaction();

    return res.status(204).send();
  } catch (err: unknown) {
    database_svc.cancelTransaction();

    throw err;
  } finally {
    database_svc.releaseClient();
  }
};
