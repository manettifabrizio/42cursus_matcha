import type { RequestHandler } from "express";
import * as Config from "@/Config";
import { service as jwt_svc } from "@/core/jwt/service";

// Function --------------------------------------------------------------------
export const middleware: RequestHandler = async (req, res, next) => {
  const header = req.headers["authorization"];

  const token = header?.substring(0, 6) === "Bearer" ? header.slice(7) : "";

  req.user = jwt_svc.verifyToken(token, Config.JWT_ACCESS_SECRET);

  return next();
};
