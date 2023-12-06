import type { RequestHandler } from "express";
import type { Account } from "@/feature/auth/entity";
import type { Picture } from "@/feature/picture/entity";
import type { User } from "../../entity";
import { HttpException } from "@/core/exception";
import { service as database_svc } from "@/core/database/service";
import { service as validation_svc } from "@/core/validation/service";
import { action as findByIdWithDistance } from "../../use-case/find-by-id-with-distance/action";
import { query as findByIdWithPosition } from "../../use-case/find-by-id-with-position/query";

// Type ------------------------------------------------------------------------
type RequestParams = {
  id_user?: string;
};

type ResponseBody = Omit<User, "id_picture"> &
  Pick<Account, "username"> & { picture: Pick<Picture, "id" | "path"> | null }
  & Partial<Pick<Account, 'email'|'email_new'>>;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestParams, ResponseBody> = async (
  req,
  res
) => {
  let user;

  if (req.params.id_user) {
    user = await findByIdWithDistance(validation_svc, database_svc, {
      id: req.params.id_user,
      id_from: req.user!.id,
    });
  } else {
    user = await findByIdWithPosition(database_svc, {
      id: req.user!.id,
    });
  }

  if (user === null) {
    throw new HttpException("Not Found", {
      cause: `User does not exist.`,
    });
  }

  return res.status(200).json(user);
};
