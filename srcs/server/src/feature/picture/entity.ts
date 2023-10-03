import type { User } from "@/feature/user/entity";

// Type ------------------------------------------------------------------------
export type Picture = {
  id: number;
  id_user: User["id"];
  path: string;
};
