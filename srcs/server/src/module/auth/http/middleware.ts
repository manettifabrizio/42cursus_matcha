import { RequestHandler }     from 'express';
import * as Config            from '@/Config';
import { service as jwt_svc } from '@/core/jwt/service';


export const middleware : RequestHandler =  async (req, res, next) =>
{
	const header = req.headers['authorization'];

	let token = "";

	if (typeof header === 'string')
	{
		token = header.split(' ')[1]; // Remove 'Bearer ' prefix
	}

	req.user = jwt_svc.verifyToken(token, Config.JWT_ACCESS_SECRET);

	return next();
};
