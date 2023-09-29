import type { RequestHandler }       from 'express';
import type { Account }              from '@/feature/auth/entity';
import type { User }                 from '../../entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { NotFoundException }         from '@/feature/error/exception';
import { action as findById }        from '../../use-case/find-by-id/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	User & Pick<Account, 'username'>
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const user = await findById(validation_svc, database_svc,
	{
		id: req.user!.id,
	});

	if (user === null)
	{
		throw new NotFoundException(`User does not exist.`);
	}

	return res.status(200).json(user);
};
