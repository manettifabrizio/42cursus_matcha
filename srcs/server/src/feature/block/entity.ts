import { User } from '../user/entity';

// Type ------------------------------------------------------------------------
export type Block =
{
	id_user_from: User['id'];
	id_user_to: User['id'];
};
