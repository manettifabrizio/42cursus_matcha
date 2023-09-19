import type { RequestHandler } from 'express';

// Type ------------------------------------------------------------------------
type ResponseBody =
{
	message: string;
};

// Function --------------------------------------------------------------------
export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	res.status(200).json({
		message: "Hello World!",
	});
};
