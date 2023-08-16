import { RequestHandler } from 'express';


export const middleware : RequestHandler =  async (req, res, next) =>
{
	const ignored_methods = new Set(['GET', 'OPTIONS', 'HEAD']);

	if (ignored_methods.has(req.method))
	{
		return next();
	}

	const valid_token = req.cookies['csrf-token'];
	const received_token = req.headers['csrf-token'];

	if (valid_token && received_token === valid_token)
	{
		return next();
	}

	res.status(401).json({
		status: {
			code: 401,
			text: "Unauthorized",
		},
		data: {
			message: "Invalid Csrf Token.",
		},
	});
};
