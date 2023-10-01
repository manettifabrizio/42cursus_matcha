import type { RequestHandler }            from 'express';
import type { Account }                   from '@/feature/auth/entity';
import type { Picture }                   from '@/feature/picture/entity';
import type { User }                      from '../../entity';
import { service as database_svc }        from '@/core/database/service';
import { service as validation_svc }      from '@/core/validation/service';
import { NotFoundException }              from '@/feature/error/exception';
import { action as findByIdWithDistance } from '../../use-case/find-by-id-with-distance/action';
import { query as findByIdWithPosition }  from '../../use-case/find-by-id-with-position/query';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Omit<User, 'id_picture'>
	& Pick<Account, 'username'>
	& { picture: Pick<Picture, 'id'|'path'> | null; }
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id?: string; }, ResponseBody> = async (req, res) =>
{
	let user;

	if (req.params.id)
	{
		user = await findByIdWithDistance(validation_svc, database_svc,
		{
			id: req.params.id,
			id_from: req.user!.id,
		});
	}
	else
	{
		user = await findByIdWithPosition(database_svc,
		{
			id: req.user!.id,
		});
	}

	if (user === null)
	{
		throw new NotFoundException(`User does not exist.`);
	}

	return res.status(200).json(user);
};
