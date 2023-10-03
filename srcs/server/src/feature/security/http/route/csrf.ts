import type { RequestHandler } from "express";
import * as Config from "@/Config";
import { service as crypto_svc } from "@/core/cryto/service";

// Type ------------------------------------------------------------------------
type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
  res.cookie("csrf-token", await crypto_svc.generateSecret(), {
    path: "/",
    secure: true,
    sameSite: "strict",
    expires: new Date(
      Date.now() + Number.parseInt(Config.CSRF_LIFETIME) * 1000
    ),
  });

  return res.status(204).send();
};
