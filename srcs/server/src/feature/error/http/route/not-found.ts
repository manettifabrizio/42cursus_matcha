import type { RequestHandler } from 'express';
import { NotFoundException }   from '@/feature/error/exception';

// Type ------------------------------------------------------------------------
type ResponseBody =
	void
;

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	throw new NotFoundException({
		cause: 'NotFound',
		details: req.url
	});
};
