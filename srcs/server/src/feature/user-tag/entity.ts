import type { Tag } from "@/feature/tag/entity";
import type { User } from "@/feature/user/entity";

// Type ------------------------------------------------------------------------
export type UserTag = {
  id_user: User["id"];
  id_tag: Tag["id"];
};
