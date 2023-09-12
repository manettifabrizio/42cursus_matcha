import type { RequestHandler } from 'express';
import { SecurityException }   from '@/feature/security/exception';

// Function --------------------------------------------------------------------
export const middleware: RequestHandler =  async (req, res, next) =>
{
	const ignored_methods = new Set(['GET', 'OPTIONS', 'HEAD']);

	if (ignored_methods.has(req.method))
	{
		return next();
	}

	const valid_token = req.cookies['csrf-token'];
	const received_token = req.headers['csrf-token'];

	if (!valid_token || received_token !== valid_token)
	{
		throw new SecurityException({
			cause: 'InvalidCsrfToken',
		});
	}

	return next();
};
