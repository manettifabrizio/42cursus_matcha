import type { RequestHandler } from "express";

// Type ------------------------------------------------------------------------
type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
  res.clearCookie("access-token");
  res.clearCookie("refresh-token");

  return res.status(204).send();
};
