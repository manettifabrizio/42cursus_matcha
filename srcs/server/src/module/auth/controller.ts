import { Router } from 'express';

import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as validation_svc } from '@/core/validation/service';
import { action as create }          from './useCase/create/action';

export const controller = Router();

controller.post('/register', async (req, res) =>
{
	const account = await create(validation_svc, database_svc, crypto_svc, req.body);

	// Todo: Send email

	res.status(200).json({
		id: account.id
	});
});
