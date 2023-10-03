import type { RequestHandler } from "express";
import type { Activity } from "@/feature/activity/entity";
import { service as database_svc } from "@/core/database/service";
import { query as findActivityByUserFrom } from "@/feature/activity/use-case/find-by-user-from/query";
import { query as findActivityByUserTo } from "@/feature/activity/use-case/find-by-user-to/query";

// Type ------------------------------------------------------------------------
type ResponseBody = {
  activities: {
    by_me: Omit<Activity, "id_user_from">[];
    to_me: Omit<Activity, "id_user_to">[];
  };
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
  const activities_by_me = await findActivityByUserFrom(database_svc, {
    id_user_from: req.user!.id,
  });

  const activities_to_me = await findActivityByUserTo(database_svc, {
    id_user_to: req.user!.id,
  });

  return res.status(200).json({
    activities: {
      by_me: activities_by_me,
      to_me: activities_to_me,
    },
  });
};
