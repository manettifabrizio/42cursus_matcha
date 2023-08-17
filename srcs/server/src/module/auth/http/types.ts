import { Account } from '../entity';


export type RegisterResponse =
{
	id: Account['id'];
};

export type LoginResponse =
{
	id: Account['id'];
};

export type RefreshResponse =
	void
;
