// Type ------------------------------------------------------------------------
export type Account =
{
	id: number;
	username: string;
	password: string;
	email: string;
	secret: string|null;
	created_at: Date;
	updated_at: Date;
};
