import { Router } from 'express';

import { service as crypto_svc } from '@/core/cryto/service';


export const controller = Router();

controller.get('/csrf', async (req, res) =>
{
	const LIFETIME_IN_SEC = 24 * 60 * 60;
	const SEC_TO_MS_FACTOR =  1000;

	res.cookie('csrf-token', crypto_svc.generateSecret(),
	{
		path: '/',
		secure: true,
		sameSite: 'strict',
		expires: new Date(Date.now() + LIFETIME_IN_SEC * SEC_TO_MS_FACTOR)
	});

	res.status(204).send();
});
