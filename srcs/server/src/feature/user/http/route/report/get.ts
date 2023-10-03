import type { RequestHandler } from "express";
import type { Report } from "@/feature/report/entity";
import { service as database_svc } from "@/core/database/service";
import { query as findReportsByUserFrom } from "@/feature/report/use-case/find-by-user-from/query";

// Type ------------------------------------------------------------------------
type ResponseBody = {
  reports: {
    by_me: Omit<Report, "id_user_from">[];
  };
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
  const reported_users = await findReportsByUserFrom(database_svc, {
    id_user_from: req.user!.id,
  });

  return res.status(200).json({
    reports: {
      by_me: reported_users,
    },
  });
};
