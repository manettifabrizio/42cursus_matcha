import type { RequestHandler } from 'express';
import { service as database_svc } from '@/core/database/service';
import { query as deleteReport } from '@/feature/report/use-case/delete/query';

// Type ------------------------------------------------------------------------
type RequestQuery = {
	id_user: string;
};

type ResponseBody = void;

// Function --------------------------------------------------------------------
export const route: RequestHandler<RequestQuery, ResponseBody> = async (
	req,
	res,
) => {
	await deleteReport(database_svc, {
		id_user_from: req.user!.id,
		id_user_to: Number(req.params.id_user) || -1,
	});

	return res.status(204).send();
};
