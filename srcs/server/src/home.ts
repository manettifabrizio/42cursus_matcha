import { Request, Response } from 'express';

export const home = async (
	_req: Request,
	_res: Response
)
	: Promise<void> =>
{
	_res.json({
		status: {
			code: 200,
			text: "Ok"
		},
		content: {
			message: "Hello World from Server!"
		}
	});
};
