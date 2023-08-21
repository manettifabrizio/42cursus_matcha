import { RequestHandler }     from 'express';
import * as Config            from '@/Config';
import { service as jwt_svc } from '@/core/jwt/service';


type ResponseBody =
	void
;

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	const payload = jwt_svc.verifyToken(
		req.signedCookies['refresh-token'],
		Config.JWT_REFRESH_SECRET
	);

	const access_token = jwt_svc.createToken(
		payload,
		Config.JWT_ACCESS_SECRET,
		Number.parseInt(Config.JWT_ACCESS_LIFETIME)
	);

	res.cookie('access-token', access_token,
	{
		secure: true,
		sameSite: 'strict',
		expires: new Date(Date.now() + Number.parseInt(Config.JWT_ACCESS_LIFETIME) * 1000),
	});

	res.status(204).send();
};
