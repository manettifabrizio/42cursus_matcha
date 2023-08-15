import { Router } from 'express';

import { service as database_svc } from '@/core/database/service'


export const controller = Router();

controller.get('/', async (req, res) =>
{
	const now = (await database_svc.query("SELECT NOW() AS date")).rows[0].date;

	res.status(200).json({
		message: "Hello World!",
		date: now
	});
});
