import { RequestHandler } from 'express';

import { AllResponse } from '../types';


export const route: RequestHandler<{}, AllResponse> = async (req, res) =>
{
	res.status(404).json({
		message: "Resource not found.",
	});
};
