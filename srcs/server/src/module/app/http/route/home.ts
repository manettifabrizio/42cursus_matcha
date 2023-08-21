import { RequestHandler } from 'express';


type ResponseBody =
{
	message: string;
};

export const route: RequestHandler<{}, ResponseBody> = async (req, res) =>
{
	res.status(200).json({
		message: "Hello World!",
	});
};
