import type { RequestHandler }          from 'express';
import type { User }                    from '../../entity';
import { service as database_svc }      from '@/core/database/service';
import { service as validation_svc }    from '@/core/validation/service';
import { action as findUserById }       from '../../use-case/find-by-id/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	User
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const user = await findUserById(validation_svc, database_svc,
	{
		id: req.user!.id,
	});

	return res.status(200).json(user!);
};
