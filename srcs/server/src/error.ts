import { Request, Response, NextFunction } from 'express';

export const error = async (
	_err: Error,
	_req: Request,
	_res: Response,
	_next: NextFunction
)
	: Promise<void> =>
{
	_res.status(500).json({
		status: {
			code: 500,
			text: "Internal Server Error"
		},
		content: {
			message: _err.message
		}
	});
};
