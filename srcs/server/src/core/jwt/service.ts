import * as jwt         from 'jsonwebtoken';
import { JwtException } from './exception';
import { JwtPayload }   from './types';
import { JwtService }   from './types';


const createToken: JwtService['createToken'] = (payload, secret, lifetime_in_sec) =>
{
	return jwt.sign(payload, secret,
	{
		expiresIn: `${lifetime_in_sec}s`,
	});
};

const verifyToken: JwtService['verifyToken'] = (token, secret) =>
{
	try
	{
		const { id } = jwt.verify(token, secret) as JwtPayload;

		return { id };
	}
	catch (err: unknown)
	{
		throw new JwtException({
			cause:
				(err instanceof jwt.TokenExpiredError) ? 'ExpiredJwt' :
				(err instanceof jwt.NotBeforeError)    ? 'NotBeforeJwt' :
				                                         'InvalidJwt',
		});
	}
};

export const service: JwtService =
{
	createToken,
	verifyToken,
};
