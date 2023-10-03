import type { RequestHandler } from "express";
import type { Tag } from "@/feature/tag/entity";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as createTag } from "@/feature/tag/use-case/create/action";
import { query as addTagToUser } from "@/feature/user-tag/use-case/add/query";

// Type ------------------------------------------------------------------------
type RequestBody = {
  name: string;
};

type ResponseBody = Tag;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody, RequestBody> = async (
  req,
  res
) => {
  try {
    database_svc.startTransaction();

    const tag = await createTag(validation_svc, database_svc, {
      name: req.body.name,
    });

    await addTagToUser(database_svc, {
      id_user: req.user!.id,
      id_tag: tag.id,
    });

    database_svc.commitTransaction();

    return res.status(200).json(tag);
  } catch (err: unknown) {
    database_svc.cancelTransaction();

    throw err;
  } finally {
    database_svc.releaseClient();
  }
};
