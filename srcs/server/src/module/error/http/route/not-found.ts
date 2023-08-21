import { RequestHandler }    from 'express';
import { NotFoundException } from '@/module/error/exception';


type ResponseBody =
	void
;

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	throw new NotFoundException({
		cause: 'NotFound',
		details: req.url
	});
};
