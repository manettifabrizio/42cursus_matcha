import type { RequestHandler } from "express";
import type { Like } from "@/feature/like/entity";
import { service as database_svc } from "@/core/database/service";
import { query as findLikesByUserFrom } from "@/feature/like/use-case/find-by-user-from/query";
import { query as findLikesByUserTo } from "@/feature/like/use-case/find-by-user-to/query";
import { query as findBlockedUsers } from "@/feature/block/use-case/find-by-user-from/query";

// Type ------------------------------------------------------------------------
type ResponseBody = {
  likes: {
    by_me: Omit<Like, "id_user_from">[];
    to_me: Omit<Like, "id_user_to">[];
  };
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) => {
  const liked_users = await findLikesByUserFrom(database_svc, {
    id_user_from: req.user!.id,
  });

  let liking_me_users = await findLikesByUserTo(database_svc, {
    id_user_to: req.user!.id,
  });

  const blocked_users = await findBlockedUsers(database_svc, { id_user_from: req.user!.id });

  liking_me_users = liking_me_users.filter(like =>
    ! blocked_users.some((block => block.id_user_to === like.id_user_from))
  );

  return res.status(200).json({
    likes: {
      by_me: liked_users,
      to_me: liking_me_users,
    },
  });
};
