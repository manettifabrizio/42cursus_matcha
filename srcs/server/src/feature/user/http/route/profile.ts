import type { RequestHandler }            from 'express';
import type { Account }                   from '@/feature/auth/entity';
import type { User }                      from '../../entity';
import { service as database_svc }        from '@/core/database/service';
import { service as validation_svc }      from '@/core/validation/service';
import { NotFoundException }              from '@/feature/error/exception';
import { action as findByIdWithDistance } from '../../use-case/find-by-id-with-distance/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	User & Pick<Account, 'username'>
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id: string; }, ResponseBody> = async (req, res) =>
{
	const user = await findByIdWithDistance(validation_svc, database_svc,
	{
		id: req.params.id,
		id_from: req.user!.id,
	});

	if (user === null)
	{
		throw new NotFoundException(`User does not exist.`);
	}

	// Todo: Add fields
	// {
	// 	is_liked: boolean;
	// 	has_liked_me: boolean;
	// 	is_blocked: boolean;
	// 	is_reported: boolean;
	// 	tags: Tags[];
	// 	pictures: Pictures[] ;
	// }

	return res.status(200).json(user);
};
