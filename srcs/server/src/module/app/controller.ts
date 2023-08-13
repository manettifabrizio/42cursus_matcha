import { Router } from 'express';


export const controller = Router();

controller.get('/', async (req, res) =>
{
	res.status(200).json({
		message: "Hello World!",
	});
});
