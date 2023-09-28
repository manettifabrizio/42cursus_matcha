import type { Tag }  from '../tag/entity';
import type { User } from '../user/entity';

// Type ------------------------------------------------------------------------
export type UserTag =
{
	id_user: User['id'];
	id_tag: Tag['id'];
};
