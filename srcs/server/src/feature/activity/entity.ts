import { User } from "../user/entity";

// Type ------------------------------------------------------------------------
export const ACTIONS = ["WATCHED_PROFILE"] as const;

export type Action = (typeof ACTIONS)[number];

export type Activity = {
  id_user_from: User["id"];
  id_user_to: User["id"];
  action: Action;
  created_at: Date;
};
