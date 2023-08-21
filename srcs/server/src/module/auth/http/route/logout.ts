import { RequestHandler } from 'express';


type ResponseBody =
	void
;

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	res.clearCookie('access-token');
	res.clearCookie('refresh-token');

	res.status(204).send();
};
