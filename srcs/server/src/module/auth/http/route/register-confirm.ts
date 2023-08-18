import { RequestHandler }            from 'express';
import { service as database_svc }   from '@/core/database/service';
import { ValidationException }       from '@/core/validation/exception';
import { service as validation_svc } from '@/core/validation/service';
import { action as registerConfirm } from '../../use-case/register-confirm/action';
import { RegisterConfirmResponse }   from '../types';


export const route: RequestHandler<{}, RegisterConfirmResponse> = async (req, res) =>
{
	const account = await registerConfirm(validation_svc, database_svc, req.body);

	if (!account)
	{
		throw new ValidationException({
			'secret': [ `Invalid crendentials.` ]
		});
	}

	res.status(204).send();
};
