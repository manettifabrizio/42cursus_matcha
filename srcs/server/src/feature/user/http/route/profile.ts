import type { RequestHandler }       from 'express';
import type { User }                 from '../../entity';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { NotFoundException }         from '@/feature/error/exception';
import { action as findUserByIdWithDistance } from '../../use-case/find-by-id-with-distance/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	User
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{ id: string; }, ResponseBody> = async (req, res) =>
{
	const user = await findUserByIdWithDistance(validation_svc, database_svc,
	{
		id_from: req.user!.id,
		id: req.params.id,
	});

	if (user === null)
	{
		throw new NotFoundException({
			cause: 'NotFound',
			details: req.params.id,
		});
	}

	return res.status(200).json(user);
};
