import { RequestHandler } from 'express';

import * as Config                   from '@/Config';
import { service as crypto_svc }     from '@/core/cryto/service';
import { service as database_svc }   from '@/core/database/service';
import { service as jwt_svc }        from '@/core/jwt/service';
import { service as validation_svc } from '@/core/validation/service';
import { ValidationException }       from '@/core/validation/exception';
import { action as login }           from '../../useCase/login/action';
import { LoginResponse }             from '../types';


export const route: RequestHandler<{}, LoginResponse> = async (req, res) =>
{
	const account = await login(validation_svc, database_svc, crypto_svc, req.body);

	if (!account)
	{
		throw new ValidationException({
			'username': [ `Invalid crendentials.` ]
		});
	}

	const refresh_token = jwt_svc.createToken(
		{ id: account.id },
		Config.JWT_REFRESH_SECRET,
		Number.parseInt(Config.JWT_REFRESH_LIFETIME)
	);

	res.cookie('refresh-token', refresh_token,
	{
		httpOnly: true,
		secure: true,
		signed: true,
		sameSite: 'strict',
		expires: new Date(Date.now() + Number.parseInt(Config.JWT_REFRESH_LIFETIME) * 1000),
	});

	res.status(200).json({
		id: account.id,
	});
};
