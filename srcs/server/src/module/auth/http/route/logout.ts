import { RequestHandler } from 'express';
import { LogoutResponse } from '../types';


export const route: RequestHandler<{}, LogoutResponse> = async (req, res) =>
{
	res.clearCookie('access-token');
	res.clearCookie('refresh-token');

	res.status(204).send();
};
