import type { RequestHandler } from "express";
import { service as database_svc } from "@/core/database/service";
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
  await deleteLike(database_svc, {
    id_user_from: req.user!.id,
    id_user_to: Number(req.params.id_user),
  });

  return res.status(204).send();
};
