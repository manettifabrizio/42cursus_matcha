import type { RequestHandler } from "express";
import type { Picture } from "@/feature/picture/entity";
import type { Tag } from "@/feature/tag/entity";
import type { User } from "@/feature/user/entity";
import type { Account } from "../../entity";
import * as Config from "@/Config";
import { HttpException } from "@/core/exception";
import { service as crypto_svc } from "@/core/cryto/service";
import { service as database_svc } from "@/core/database/service";
import { service as jwt_svc } from "@/core/jwt/service";
import { service as validation_svc } from "@/core/validation/service";
import { query as findUserByIdWithPosition } from "@/feature/user/use-case/find-by-id-with-position/query";
import { query as findPicturesByUser } from "@/feature/picture/use-case/find-by-user/query";
import { query as findTagsByUser } from "@/feature/user-tag/use-case/find-by-user/query";
import { action as findAccountByCredentials } from "../../use-case/find-by-credentials/action";

// Type ------------------------------------------------------------------------
type RequestBody = {
  username: string;
  password: string;
};

type ResponseBody = Omit<User, "id_picture"> &
  Pick<Account, "username"|"email"|"email_new"> & {
    picture: Pick<Picture, "id" | "path"> | null;
    pictures: Pick<Picture, "id" | "path">[];
    tags: Tag[];
  };

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody, RequestBody> = async (
  req,
  res
) => {
  const account = await findAccountByCredentials(
    validation_svc,
    database_svc,
    crypto_svc,
    {
      username: req.body.username,
      password: req.body.password,
    }
  );

  if (account === null) {
    throw new HttpException("Unauthorized", {
      cause: `Invalid credentials.`,
    });
  }

  if (account.is_confirmed === false) {
    throw new HttpException("Forbidden", {
      cause: `Account email hasn't been confirmed.`,
    });
  }

  const user = (await findUserByIdWithPosition(database_svc, {
    id: account.id,
  }))!;
  const pictures = await findPicturesByUser(database_svc, { id_user: user.id });
  const tags = await findTagsByUser(database_svc, { id_user: user.id });

  const refresh_token = jwt_svc.createToken(
    account,
    Config.JWT_REFRESH_SECRET,
    Number.parseInt(Config.JWT_REFRESH_LIFETIME)
  );

  res.cookie("refresh-token", refresh_token, {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "strict",
    expires: new Date(
      Date.now() + Number.parseInt(Config.JWT_REFRESH_LIFETIME) * 1000
    ),
  });

  const access_token = jwt_svc.createToken(
    account,
    Config.JWT_ACCESS_SECRET,
    Number.parseInt(Config.JWT_ACCESS_LIFETIME)
  );

  res.cookie("access-token", access_token, {
    secure: true,
    sameSite: "strict",
    expires: new Date(
      Date.now() + Number.parseInt(Config.JWT_ACCESS_LIFETIME) * 1000
    ),
  });

  return res.status(200).json({
    ...user,
    pictures,
    tags,
  });
};
