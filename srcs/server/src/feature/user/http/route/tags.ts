import type { RequestHandler }          from 'express';
import type { Tag }                     from '@/feature/tag/entity';
import { service as database_svc }      from '@/core/database/service';
import { service as validation_svc }    from '@/core/validation/service';
import { action as findTagsByIds }       from '@/feature/tag/use-case/find-by-id-bulk/action';
import { action as findUserRelatedTags } from '@/feature/user-tag/use-case/find-by-user/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Tag[]
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const user_tags = await findUserRelatedTags(validation_svc, database_svc,
	{
		id_user: req.user!.id,
	});

	const tags = await findTagsByIds(validation_svc, database_svc,
	{
		ids: user_tags.map(user_tag => user_tag.id_tag),
	});

	return res.status(200).json(tags);
};
