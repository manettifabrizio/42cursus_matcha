import { RequestHandler } from 'express';

import { HomeResponse } from '../types';


export const route: RequestHandler<{}, HomeResponse> = async (req, res) =>
{
	res.status(200).json({
		message: "Hello World!",
	});
};
