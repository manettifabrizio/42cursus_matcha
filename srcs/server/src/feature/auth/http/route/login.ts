import type { RequestHandler }         from 'express';
import type { Account }                from '../../entity';
import * as Config                     from '@/Config';
import { service as crypto_svc }       from '@/core/cryto/service';
import { service as database_svc }     from '@/core/database/service';
import { service as jwt_svc }          from '@/core/jwt/service';
import { service as validation_svc }   from '@/core/validation/service';
import { AuthException }               from '../../exception';
import { action as findByCredentials } from '../../use-case/find-by-credentials/action';

// Type ------------------------------------------------------------------------
type ResponseBody =
	Pick<Account, 'id'>
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const account = await findByCredentials(validation_svc, database_svc, crypto_svc,
	{
		username: req.body.username,
		password: req.body.password,
	});

	if (account === null)
	{
		throw new AuthException({
			cause: "Invalid credentials.",
		});
	}

	const refresh_token = jwt_svc.createToken(
		account,
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

	const access_token = jwt_svc.createToken(
		account,
		Config.JWT_ACCESS_SECRET,
		Number.parseInt(Config.JWT_ACCESS_LIFETIME)
	);

	res.cookie('access-token', access_token,
	{
		secure: true,
		sameSite: 'strict',
		expires: new Date(Date.now() + Number.parseInt(Config.JWT_ACCESS_LIFETIME) * 1000),
	});

	return res.status(200).json(account);
};
