import { Router } from 'express';


export const controller = Router();

controller.get('/', async (req, res) =>
{
	res.status(404).json({
		error: "Resource not found.",
	});
});
