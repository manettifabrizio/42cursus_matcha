import type { RequestHandler } from "express";
import { HttpException } from "@/core/exception";

// Type ------------------------------------------------------------------------
type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
  throw new HttpException("Not Found", {
    cause: `Resource '${req.originalUrl}' does not exists.`,
  });
};
