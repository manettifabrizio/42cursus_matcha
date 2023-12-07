// Type ------------------------------------------------------------------------
export type Account = {
  id: number;
  username: string;
  password: string;
  email: string;
  email_new: string;
  secret: string | null;
  is_confirmed: boolean;
};
