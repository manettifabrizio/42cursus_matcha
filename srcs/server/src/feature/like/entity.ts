import { User } from '@/feature/user/entity';

// Type ------------------------------------------------------------------------
export type Like =
{
	id_user_from: User['id'];
	id_user_to: User['id'];
};
